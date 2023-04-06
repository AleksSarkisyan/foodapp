import { Enums, Types } from '@asarkisyan/nestjs-foodapp-shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, firstValueFrom } from 'rxjs';
import { OrderGateway } from './order.gateway';


@Injectable()
export class OrderService {
  constructor(
    @Inject(Enums.Restaurant.Generic.SERVICE_NAME) public client: ClientProxy,
    @Inject(Enums.User.Generic.SERVICE_NAME) public userClient: ClientProxy,
    @Inject(Enums.Payment.Generic.SERVICE_NAME) public paymentClient: ClientProxy,
    private orderGateway: OrderGateway
  ) {

  }
  async createOld(createOrderDto: Types.Order.CreateOrderDto) {
    let userToken = this.userClient.send({ cmd: Enums.User.Commands.GET_USER_FROM_TOKEN }, { token: createOrderDto.token });
    let user: Types.RestaurantUser.User = await firstValueFrom(userToken);
    createOrderDto.userId = user.id;

    let message = this.client.send({ cmd: Enums.Order.Commands.CREATE_ORDER }, createOrderDto);

    let orderResult = await firstValueFrom(message)

    this.orderGateway.server.emit(Enums.Restaurant.Websocket.ORDER_CREATED, JSON.stringify(orderResult))

    return orderResult;
  }

  /* 
    0 Get user from token [ OK ]
    1 Get products from DB and return them [ OK ]
    2 Loop and create stripe product if product doesn't have a stripeId already [ OK ]
    2.1 Prepare new array with products that now have stripeId [ OK ]
    2.2 Bulk update products DB [ OK ]
    3 Get stripe product by id  [ OK ]
    3.1 Compare product price with stripe price [ OK ]
    3.2 If not same create new price [ OK ]
    3.3 Archive old stripe price [ OK ]
    3.4 Update DB with new price [ OK ]
    4 Create order [ OK ]
    4.1 Prepare array from DB with stripeProductIds and quantity [ OK ]
    4.2 Create session and return success/error url [ OK ]
  */
  async create(createOrderDto: Types.Order.CreateOrderDto) {

    /** 0 */
    createOrderDto.userId = await this.getUserFromToken(createOrderDto);
    console.log('createOrderDto is', createOrderDto);

    /** 1 */
    let productOrderDetailsResult: Types.OrderProduct.OrderProductDetails = await this.getProductOrderDetails(createOrderDto);

    if (!productOrderDetailsResult.availableProducts.length) {
      return {
        success: false,
        message: 'No products found'
      }
    }

    /** 2 */
    let productsFound = productOrderDetailsResult.availableProducts;
    let productsToUpdate = [];

    for (let [productKey, product] of Object.entries(productsFound)) {
      if (!product.stripeId) {
        let { stripeProduct, stripePrice } = await this.createStripeProductAndPrice(product);
        console.log('stripeProduct is', stripeProduct)
        console.log('stripePrice is', stripePrice)

        /** 2.1 */
        productsToUpdate.push({
          ...product,
          productId: product.id,
          stripeId: stripeProduct.id,
          stripePrice: stripePrice.id,
          userId: productOrderDetailsResult.restaurantUserId['userId']
        });

        console.log('productsToUpdate is', productsToUpdate)

      } else {
        /** 3 Decide whether this is a good idea, since the Stripe call increases the request time from 50ms to 500ms for a single product 
         * Use DB timestamp flag to check if priceUpdateDate > stripePriceUpdateDate
        */
        let findStripteProductResult = await this.findStripeProduct(product);
        console.log('findStripteProductResult is', findStripteProductResult)

        /** 3.1 Price mismatch */
        if (findStripteProductResult.price && findStripteProductResult.price.unit_amount / 100 != product.price) {
          console.log('archive...')
          /** 3.2 & 3.3 Archive price and create new one */
          let { archive, price } = await this.archiveAndCreateNewStripePrice(product);

          console.log('archive is', archive)
          console.log('price is', price)

          /** 3.4 Don't expect this to happen a lot, so no need to do this outside of the loop */
          product.stripePrice = price.id;
          await this.updateProductCheckout(product);
        }
      }
    }

    console.log('productsToUpdate is', productsToUpdate)

    /** 2.2 */
    if (productsToUpdate.length) {
      let updateProductsResult = await this.updateProducts(productsToUpdate, productOrderDetailsResult)
      console.log('updateProductsResult is', updateProductsResult)
    } else {
      console.log('no products to update')
    }

    /** 4 */
    let message = this.client.send({ cmd: Enums.Order.Commands.CREATE_ORDER }, createOrderDto);
    let orderResult = await firstValueFrom(message)
    console.log('orderResult is', orderResult)

    let stripeSessionData = orderResult.stripeCheckoutSessionData;
    console.log('stripeSessionData is', stripeSessionData)
    /** 4.1 */
    if (!stripeSessionData.length) {
      return {
        error: true,
        message: 'Could not get stripe products'
      }
    }

    /** 4.2 */
    let stripeSession = this.paymentClient.send({ cmd: 'createStripePayment' }, stripeSessionData);
    let stripeSessionResult = await firstValueFrom(stripeSession);

    console.log('stripeSessionResult -', stripeSessionResult)

    //this.orderGateway.server.emit(Enums.Restaurant.Websocket.ORDER_CREATED, JSON.stringify(orderResult))

    return {
      success: true,
      productOrderDetailsResult,
      productsFound,
      orderResult,
      stripeSessionResult
    }
  }

  async getUserFromToken(createOrderDto: Types.Order.CreateOrderDto) {
    let userToken = this.userClient.send({ cmd: Enums.User.Commands.GET_USER_FROM_TOKEN }, { token: createOrderDto.token });
    let user: Types.User.User = await firstValueFrom(userToken);

    return user.id;
  }

  async getProductOrderDetails(createOrderDto: Types.Order.CreateOrderDto) {
    let productOrder = this.client.send({ cmd: 'getProductOrderDetails' }, createOrderDto);

    return await firstValueFrom(productOrder)
  }

  async createStripeProductAndPrice(product: Types.OrderProduct.AvailableProducts) {
    let createStripteAndProduct = this.paymentClient.send({ cmd: 'createStripeProductAndPrice' }, product);

    return await firstValueFrom(createStripteAndProduct);
  }

  async findStripeProduct(product: Types.OrderProduct.AvailableProducts) {
    let findStripteProduct = this.paymentClient.send(
      { cmd: 'findStripeProduct' },
      { productId: product.stripeId, priceId: product.stripePrice }
    );

    return await firstValueFrom(findStripteProduct);
  }

  async archiveAndCreateNewStripePrice(product: Types.OrderProduct.AvailableProducts) {
    let archiveAndCreatePrice = this.paymentClient.send(
      { cmd: 'archiveAndCreateNewStripePrice' },
      {
        productId: product.stripeId,
        priceId: product.stripePrice,
        productPrice: product.price
      });

    return await firstValueFrom(archiveAndCreatePrice);
  }

  async updateProductCheckout(product: Types.OrderProduct.AvailableProducts) {
    let updateStripeProduct = this.client.send({ cmd: 'updateProductCheckout' }, { productId: product.id, product });

    return await firstValueFrom(updateStripeProduct)
  }

  async updateProducts(productsToUpdate, productOrderDetailsResult) {
    let updateProducts = this.client.send(
      { cmd: 'updateProducts' },
      {
        products: productsToUpdate,
        restaurantId: productOrderDetailsResult.restaurantId,
        productIds: productOrderDetailsResult.productIds
      })
    return await firstValueFrom(updateProducts);
  }

}
