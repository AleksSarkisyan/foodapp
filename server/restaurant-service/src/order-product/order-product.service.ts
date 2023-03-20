import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateOrderProductDto } from './dto/create-order-product.dto';
import { OrderProduct } from './entities/order-product.entity';

@Injectable()
export class OrderProductService {
  constructor(
    @InjectModel(OrderProduct)
    private orderProductModel: typeof OrderProduct,
  ) { }
  async create(createOrderProductDto: CreateOrderProductDto) {
    return await this.orderProductModel.bulkCreate(createOrderProductDto.products);
  }

}
