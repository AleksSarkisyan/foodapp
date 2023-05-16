import { Types } from '@asarkisyan/nestjs-foodapp-shared';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OrderProduct } from './entities/order-product.entity';
import { QueryTypes } from 'sequelize';

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

  async findByOrderId(orderId: number) {
    return await OrderProduct.sequelize.query(`
      SELECT 
        order_products.id, order_id, product_id, quantity, order_products.price,
        products.name, products.description, weight, category_id,
        categories.id, categories.name as categoryName
      FROM order_products
        JOIN products ON products.id = order_products.product_id
        JOIN categories ON categories.id = products.category_id
        WHERE order_products.order_id = ${orderId}
    `, { type: QueryTypes.SELECT });
  }

}
