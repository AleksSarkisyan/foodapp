import { Types } from '@asarkisyan/nestjs-foodapp-shared';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OrderProduct } from './entities/order-product.entity';

@Injectable()
export class OrderProductService {
  constructor(
    @InjectModel(OrderProduct)
    private orderProductModel: typeof OrderProduct,
  ) { }
  async create(createOrderProductDto: Types.OrderProduct.CreateOrderProductDto) {
    return await this.orderProductModel.bulkCreate(createOrderProductDto.products);
  }

  async getOrderTotal(orderId: number) {
    return await OrderProduct.sequelize.query(`
      SELECT SUM(quantity) AS quantity,
      SUM(price * quantity) AS totalPrice
      FROM order_products 
      WHERE order_products.order_id = ${orderId};
    `);
  }

}
