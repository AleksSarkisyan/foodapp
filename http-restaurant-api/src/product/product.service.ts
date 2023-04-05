import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Enums, Types } from '@asarkisyan/nestjs-foodapp-shared';


@Injectable()
export class ProductService {
  constructor(
    @Inject(Enums.Restaurant.Generic.SERVICE_NAME) public client: ClientProxy,
    @Inject(Enums.Payment.Generic.SERVICE_NAME) public paymentClient: ClientProxy) { }

  async create(createProductDto: Types.Product.CreateProductDto) {
    try {
      let product = await this.createProduct(createProductDto);

      if (!product || product['error']) {
        return this.errorMessage('creating product failed');
      }

      let { stripeProduct, stripePrice } = await this.createStripeProductAndPrice(product);
      console.log('stripeProduct is', stripeProduct)

      if (!stripeProduct || !stripeProduct.id) {
        return this.errorMessage('creating stripe product failed')
      }

      if (!stripePrice || !stripePrice.id) {
        return this.errorMessage('creating product price failed')
      }

      console.log('createProductDto is', createProductDto)

      let updateProduct = await this.updateProduct({
        stripeId: stripeProduct.id,
        stripePrice: stripePrice.id,
        token: createProductDto.token,
        productId: product.id
      });

      if (!updateProduct || updateProduct[0] != 1) {
        return this.errorMessage('updating product failed')
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

    console.log('productResult is', productResult)

    return productResult;
  }

  async createStripeProductAndPrice(product: Types.Product.ProductDto) {
    let stripeProduct = this.paymentClient.send({ cmd: 'createStripeProductAndPrice' }, product);
    let stripeProductResult = await firstValueFrom(stripeProduct);

    console.log('stripeProductResult is', stripeProductResult)

    return stripeProductResult;
  }

  async updateProduct(stripeProductData) {
    let updateProduct = this.client.send({ cmd: 'updateProduct' }, stripeProductData);
    let updateProductResult = await firstValueFrom(updateProduct);

    console.log('updateProductResult is', updateProductResult)

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
