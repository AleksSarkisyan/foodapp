import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StripeService } from './stripe.service';
import { Types } from '@asarkisyan/nestjs-foodapp-shared';


@Controller()
export class StripeController {
  constructor(private readonly stripeService: StripeService) { }

  @MessagePattern({ cmd: 'createStripePayment' })
  async create(@Payload() productData) {
    return await this.stripeService.createStripeSession(productData);
  }

  @MessagePattern({ cmd: 'createStripeProductAndPrice' })
  async createStripeProductAndPrice(@Payload() product: Types.Product.ProductDto) {

    let stripeProduct = await this.stripeService.createStripeProductAndPrice(product);
    let stripePrice = await this.stripeService.createStripePrice(stripeProduct['id'], product.price);

    return {
      stripeProduct,
      stripePrice
    }
  }

  @MessagePattern({ cmd: 'findStripeProduct' })
  async findStripeProduct(@Payload() { productId, priceId }) {
    let product = await this.stripeService.findStripeProduct(productId);
    let price = await this.stripeService.findStripePrice(priceId);

    console.log('stripe price is -', price)
    console.log('stripe product is -', product)

    return {
      product,
      price
    }
  }

  @MessagePattern({ cmd: 'archiveAndCreateNewStripePrice' })
  async archiveAndCreateNewStripePrice(@Payload() { productId, priceId, productPrice }) {
    let archive = await this.stripeService.archiveStripePrice(priceId);
    let price = await this.stripeService.createStripePrice(productId, productPrice);

    return {
      archive,
      price
    }
  }

  @MessagePattern('removeStripe')
  remove(@Payload() id: number) {
    return this.stripeService.remove(id);
  }
}
