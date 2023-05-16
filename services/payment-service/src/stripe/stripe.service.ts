import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { Types, Enums } from '@asarkisyan/nestjs-foodapp-shared';

const messages = Enums.Messages.Messages;
@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2022-11-15',
    });
  }
  async createStripeSession(productData: Types.Stripe.StripeCheckoutSession[]) {
    return await this.stripe.checkout.sessions.create({
      line_items: productData,
      mode: 'payment',
      success_url: `http://localhost:3009/order/success`, // FE urls
      cancel_url: `http://localhost:3009/order/cancel`,
    });
  }

  async createStripeProduct(product: Types.Product.ProductDto) {
    let stripeProduct = await this.stripe.products.create({
      name: product.name,
      description: product.description
    })

    if (!stripeProduct.id) {
      return this.errorMessage(messages.CREATE_PRODUCT_PRICE_ERROR)
    }

    return stripeProduct;
  }

  async createStripePrice(id: string, productPrice: number) {
    let formattedPrice = this.formatPrice(productPrice);

    let result = await this.stripe.prices.create({
      unit_amount_decimal: formattedPrice,
      currency: 'bgn',
      product: id,
    });

    if (!result.id) {
      return this.errorMessage(messages.CREATE_PRICE_ERROR)
    }

    return result;
  }

  async findStripeProduct(id: string) {
    if (!id) {
      return this.errorMessage(messages.STRIPE_ID_ERROR)
    }

    let product = await this.stripe.products.retrieve(id);

    if (!product.id) {
      return this.errorMessage(messages.FIND_STRIPE_PRODUCT_ERROR)
    }

    return product;
  }

  async findStripePrice(id: string) {
    if (!id) {
      return this.errorMessage(messages.STRIPE_PRICE_ID_ERROR)
    }

    let price = await this.stripe.prices.retrieve(id);

    if (!price.id) {
      return this.errorMessage(messages.STRIPE_PRICE_ERROR)
    }

    return price;
  }

  async archiveStripePrice(id: string) {
    if (!id) {
      return this.errorMessage(messages.STRIPE_PRICE_ID_ERROR)
    }

    let price = await this.stripe.prices.update(
      id,
      { active: false }
    );

    if (!price.id) {
      return this.errorMessage(messages.STRIPE_ARCHIVE_ERROR)
    }

    return price;
  }

  errorMessage(message: string) {
    return {
      error: true,
      message
    }
  }

  formatPrice(productPrice: number) {
    let priceNum = (Number(productPrice) * 100);
    return priceNum.toFixed(1);
  }

}
