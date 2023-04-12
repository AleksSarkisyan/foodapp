import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Enums, Types } from '@asarkisyan/nestjs-foodapp-shared';

const messages = Enums.Messages.Messages;

@Injectable()
export class ProductService {
  constructor(
    @Inject(Enums.Restaurant.Generic.SERVICE_NAME) public client: ClientProxy,
    @Inject(Enums.Payment.Generic.SERVICE_NAME) public paymentClient: ClientProxy) { }

  async create(createProductDto: Types.Product.CreateProductDto) {
    try {
      let product = await this.createProduct(createProductDto);

      if (!product || product['error']) {
        return this.errorMessage(messages.CREATE_PRODUCT_ERROR);
      }

      let { stripeProduct, stripePrice } = await this.createStripeProductAndPrice(product);

      if (!stripeProduct || !stripeProduct.id) {
        return this.errorMessage(messages.CREATE_STRIPE_PRODUCT_ERROR)
      }

      if (!stripePrice || !stripePrice.id) {
        return this.errorMessage(messages.CREATE_PRODUCT_PRICE_ERROR)
      }

      let updateProduct: Partial<Types.Product.ProductDto> = await this.updateProduct({
        stripeId: stripeProduct.id,
        stripePrice: stripePrice.id,
        token: createProductDto.token,
        id: product.id
      });

      if (!updateProduct || updateProduct[0] != 1) {
        return this.errorMessage(messages.UPDATE_PRODUCT_ERROR)
      }

      return {
        product,
        stripeProduct,
        updateProduct
      };
    } catch (error) {
      throw error;
    }
  }

  async createProduct(createProductDto: Types.Product.CreateProductDto) {
    let product = this.client.send({ cmd: Enums.Product.Commands.CREATE_PRODUCT }, createProductDto);
    let productResult: Types.Product.ProductDto = await firstValueFrom(product);

    return productResult;
  }

  async createStripeProductAndPrice(product: Types.Product.ProductDto) {
    let stripeProduct = this.paymentClient.send({ cmd: Enums.Stripe.Commands.CREATE_STRIPE_PRODUCT_AND_PRICE }, product);
    let stripeProductResult = await firstValueFrom(stripeProduct);

    return stripeProductResult;
  }

  async updateProduct(stripeProductData: Partial<Types.Product.ProductDto>) {
    let updateProduct = this.client.send({ cmd: Enums.Product.Commands.UPDATE_PRODUCT }, stripeProductData);
    let updateProductResult = await firstValueFrom(updateProduct);

    return updateProductResult;
  }

  errorMessage(message: string) {
    Logger.log(message);
    return {
      error: true,
      message
    }
  }
}
