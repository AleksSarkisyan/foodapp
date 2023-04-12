import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StripeService } from './stripe.service';
import { Types, Enums } from '@asarkisyan/nestjs-foodapp-shared';


@Controller()
export class StripeController {
  constructor(private readonly stripeService: StripeService) { }

  @MessagePattern({ cmd: Enums.Stripe.Commands.CREATE_STRIPE_SESSION })
  async create(@Payload() productData) {
    return await this.stripeService.createStripeSession(productData);
  }

  @MessagePattern({ cmd: Enums.Stripe.Commands.CREATE_STRIPE_PRODUCT_AND_PRICE })
  async createStripeProductAndPrice(@Payload() product: Types.Product.ProductDto) {

    let stripeProduct = await this.stripeService.createStripeProductAndPrice(product);
    let stripePrice = await this.stripeService.createStripePrice(stripeProduct['id'], product.price);

    return {
      stripeProduct,
      stripePrice
    }
  }

  @MessagePattern({ cmd: Enums.Stripe.Commands.FIND_STRIPE_PRODUCT })
  async findStripeProduct(@Payload() { productId, priceId }) {
    let product = await this.stripeService.findStripeProduct(productId);
    let price = await this.stripeService.findStripePrice(priceId);

    return {
      product,
      price
    }
  }

  @MessagePattern({ cmd: Enums.Stripe.Commands.ARCHIVE_AND_CREATE_NEW_STRIPE_PRICE })
  async archiveAndCreateNewStripePrice(@Payload() { productId, priceId, productPrice }) {
    let archive = await this.stripeService.archiveStripePrice(priceId);
    let price = await this.stripeService.createStripePrice(productId, productPrice);

    return {
      archive,
      price
    }
  }
}
