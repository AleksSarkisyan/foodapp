import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { Types } from '@asarkisyan/nestjs-foodapp-shared';

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
  async createStripeSession(productData) {


    console.log('stripe productData is', productData)

    let session = await this.stripe.checkout.sessions.create({
      line_items: productData,
      mode: 'payment',
      success_url: `http://localhost:3000/success`,
      cancel_url: `http://localhost:3000/cancel`,
    });

    console.log('session is', session)

    return session;
  }

  async createStripeProductAndPrice(product: Types.Product.ProductDto) {
    console.log('product is--', product)

    let priceNum = (Number(product.price) * 100);
    console.log('priceNum is', priceNum)
    let price = priceNum.toFixed(1);
    console.log('price is', price)

    let result = await this.stripe.products.create({
      name: product.name,
      description: product.description,
      default_price_data: {
        currency: 'bgn',
        unit_amount_decimal: price
      }
    })

    console.log('stripe product is', result)

    if (!result) {
      return {
        error: result
      }
    }

    return result;
  }

  async createStripePrice(id: string, productPrice: number) {
    let priceNum = (Number(productPrice) * 100);
    console.log('priceNum is', priceNum)
    let price = priceNum.toFixed(1);
    console.log('price is', price)
    return await this.stripe.prices.create({
      unit_amount_decimal: price,
      currency: 'bgn',
      product: id,
    })

  }

  async findStripeProduct(id: string) {
    console.log('stripeId is', id)

    if (!id) {
      return this.setError('Missing stripeId')
    }

    let product = await this.stripe.products.retrieve(id);
    console.log('stripe product is', product)
    if (!product) {
      return this.setError('Could not find stripe product')
    }

    return product;
  }

  async findStripePrice(id: string) {
    console.log('stripePriceId is -', id)

    if (!id) {
      return this.setError('Missing stripePriceId')
    }

    let price = await this.stripe.prices.retrieve(id);
    console.log('stripe price is', price)
    if (!price) {
      return this.setError('Could not find stripe price')
    }

    return price;
  }

  async archiveStripePrice(id: string) {
    console.log('stripePriceId is', id)

    if (!id) {
      return this.setError('Missing stripePriceId')
    }

    let price = await this.stripe.prices.update(
      id,
      { active: false }
    );
    console.log('stripe price is', price)
    if (!price) {
      return this.setError('Could not archive stripe price')
    }

    return price;
  }

  setError(message) {
    return {
      error: true,
      message
    }
  }


  remove(id: number) {
    return `This action removes a #${id} stripe`;
  }
}
