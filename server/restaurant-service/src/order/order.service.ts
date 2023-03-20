import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OrderProduct } from 'src/order-product/entities/order-product.entity';
import { OrderProductService } from 'src/order-product/order-product.service';
import { Product } from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/product.service';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
    private productService: ProductService,
    private restaurantService: RestaurantService,
    private orderProductService: OrderProductService
  ) { }

  async create(createOrderDto: CreateOrderDto) {
    const { restaurantId, userId } = createOrderDto;
    const restaurantUserId = await this.restaurantService.findOne(restaurantId);
    const productIds = createOrderDto.products.map((obj) => obj.productId);
    const totalQuantity = this.calculateTotal(createOrderDto.products as OrderProduct[], 'quantity');
    const availableProducts = await this.productService.findRestaurantProducts({
      restaurantUserId: restaurantUserId.userId,
      productIds
    });
    const totalPrice = this.calculateTotal(availableProducts, 'price');

    const orderData = {
      userId,
      restaurantId,
      totalQuantity,
      totalPrice,
      status: 'CREATED'
    }

    const order = await this.orderModel.create({ ...orderData })

    let orderProductsData = [];
    for (let [key, product] of Object.entries(availableProducts)) {
      createOrderDto.products.find((orderDto) => {
        if (orderDto.productId == product.id) {
          orderProductsData.push({
            productId: product.id,
            price: product.price,
            quantity: orderDto.quantity,
            orderId: order.id
          })
        }
      })
    }

    await this.orderProductService.create({ products: orderProductsData });

    return createOrderDto;
  }

  calculateTotal(array: readonly (Product | OrderProduct)[], key: string) {
    return array.reduce((accumulator, object) => {
      return accumulator + object[key];
    }, 0);
  }

}
