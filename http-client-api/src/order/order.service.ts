import { Enums, Types } from '@asarkisyan/nestjs-foodapp-shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
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
    4.2 Create session and return stripe redirect url [ OK ]
  */
  async create(createOrderDto: Types.Order.CreateOrderDto) {

    /** WS testing */
    // this.orderGateway.server.emit(Enums.Restaurant.Websocket.ORDER_CREATED, JSON.stringify({ message: 'Order created!', order: createOrderDto }))
    // return {
    //   success: true,
    //   message: 'OK'
    // }
    /** 0 */
    createOrderDto.userId = await this.getUserFromToken(createOrderDto);

    /** 1 */
    let productOrderDetailsResult: Types.OrderProduct.OrderProductDetails = await this.getProductOrderDetails(createOrderDto);

    if (!productOrderDetailsResult.availableProducts.length) {
      return {
        success: false,
        message: Enums.Product.Messages.NO_PRODUCTS_FOUND
      }
    }

    /** 2 */
    let productsFound = productOrderDetailsResult.availableProducts;
    let productsToUpdate: Types.OrderProduct.AvailableProducts[] = [];

    for (let [productKey, product] of Object.entries(productsFound)) {
      if (!product.stripeId) {
        let { stripeProduct, stripePrice } = await this.createStripeProductAndPrice(product);

        /** 2.1 */
        productsToUpdate.push({
          ...product,
          stripeId: stripeProduct.id,
          stripePrice: stripePrice.id,
          userId: productOrderDetailsResult.restaurantUserId['userId']
        });
      } else {
        /** 3 To do Decide whether this is a good idea, since the Stripe call increases the request time from 50ms to 500ms for a single product 
         * Use DB timestamp flag to check if priceUpdateDate > stripePriceUpdateDate
        */
        let { price }: Types.Stripe.StripePriceDto = await this.findStripeProduct(product);

        /** 3.1 Price mismatch */
        if (price && price.unit_amount / 100 != product.price) {
          /** 3.2 & 3.3 Archive price and create new one */
          let { price: newPrice }: Types.Stripe.StripePriceDto = await this.archiveAndCreateNewStripePrice(product);

          /** 3.4 Don't expect this to happen a lot, so no need to do this outside of the loop */
          product.stripePrice = newPrice.id;
          await this.updateProductCheckout(product);
        }
      }
    }

    /** 2.2 */
    if (productsToUpdate.length) {
      await this.updateProducts(productsToUpdate, productOrderDetailsResult)
    }

    /** 4 */
    let message = this.client.send({ cmd: Enums.Order.Commands.CREATE_ORDER }, createOrderDto);
    let orderResult = await firstValueFrom(message)

    let stripeSessionData: Types.Stripe.StripeCheckoutSession[] = orderResult.stripeCheckoutSessionData;

    /** 4.1 */
    if (!stripeSessionData.length) {
      return stripeSessionData;
    }

    /** 4.2 */
    let stripeSession = this.paymentClient.send({ cmd: Enums.Stripe.Commands.CREATE_STRIPE_SESSION }, stripeSessionData);
    let stripeSessionResult = await firstValueFrom(stripeSession);

    /** to do This should happen only after a successful payment */
    // this.orderGateway.server.emit(Enums.Restaurant.Websocket.ORDER_CREATED, JSON.stringify({ message: 'Order created!', order: createOrderDto }))

    return {
      success: true,
      stripeRedirectUrl: stripeSessionResult.url
    }
  }

  async getUserFromToken(createOrderDto: Types.Order.CreateOrderDto | { token: string }) {
    let userToken = this.userClient.send({ cmd: Enums.User.Commands.GET_USER_FROM_TOKEN }, { token: createOrderDto.token });
    let user: Types.User.User = await firstValueFrom(userToken);

    return user.id;
  }

  async getProductOrderDetails(createOrderDto: Types.Order.CreateOrderDto) {
    let productOrder = this.client.send({ cmd: Enums.Product.Commands.GET_ORDER_PRODUCT_DETAIL }, createOrderDto);

    return await firstValueFrom(productOrder)
  }

  async createStripeProductAndPrice(product: Types.OrderProduct.AvailableProducts) {
    let createStripteAndProduct = this.paymentClient.send({ cmd: Enums.Stripe.Commands.CREATE_STRIPE_PRODUCT_AND_PRICE }, product);

    return await firstValueFrom(createStripteAndProduct);
  }

  async findStripeProduct(product: Types.OrderProduct.AvailableProducts) {
    let findStripteProduct = this.paymentClient.send(
      { cmd: Enums.Stripe.Commands.FIND_STRIPE_PRODUCT },
      { productId: product.stripeId, priceId: product.stripePrice }
    );

    return await firstValueFrom(findStripteProduct);
  }

  async archiveAndCreateNewStripePrice(product: Types.OrderProduct.AvailableProducts) {
    let archiveAndCreatePrice = this.paymentClient.send(
      { cmd: Enums.Stripe.Commands.ARCHIVE_AND_CREATE_NEW_STRIPE_PRICE },
      {
        productId: product.stripeId,
        priceId: product.stripePrice,
        productPrice: product.price
      });

    return await firstValueFrom(archiveAndCreatePrice);
  }

  async updateProductCheckout(product: Types.OrderProduct.AvailableProducts) {
    let updateStripeProduct = this.client.send({ cmd: Enums.Product.Commands.UPDATE_PRODUCT_CHECKOUT }, { productId: product.id, product });

    return await firstValueFrom(updateStripeProduct)
  }

  async updateProducts(productsToUpdate: Types.OrderProduct.AvailableProducts[], productOrderDetailsResult: Types.OrderProduct.OrderProductDetails) {
    let updateProducts = this.client.send(
      { cmd: Enums.Product.Commands.UPDATE_PRODUCTS },
      {
        products: productsToUpdate,
        restaurantId: productOrderDetailsResult.restaurantId
      })
    return await firstValueFrom(updateProducts);
  }

  async notifyRestaurant(notifyRestaurantDto: { token: string }) {
    /** Get token */
    let userId = await this.getUserFromToken(notifyRestaurantDto);

    if (!userId) {
      return {
        success: false,
        message: Enums.User.Messages.USER_NOT_FOUND
      }
    }

    /** Check if user has an actual order in created status */
    let latestOrder = this.client.send({ cmd: 'getLastUserOrder' }, { userId });
    let latestOrderResult = await firstValueFrom(latestOrder)

    console.log('latestOrderResult is', latestOrderResult)

    if (!latestOrderResult.order.id) {
      return {
        success: false,
        message: 'Could not find order'
      }
    }

    let { order, orderDetails } = latestOrderResult;

    /** Notify restaurant */
    this.orderGateway.server.emit(Enums.Restaurant.Websocket.ORDER_CREATED, JSON.stringify({ message: 'Order created!', order, orderDetails }))

    return latestOrderResult;
  }

}
