import { Controller, Post, Body, Headers } from '@nestjs/common';
import { OrderService } from './order.service';
import { Types } from '@asarkisyan/nestjs-foodapp-shared';


@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post('/create')
  async create(@Body() createOrderDto: Types.Order.CreateOrderDto, @Headers() headers) {
    createOrderDto.token = headers['authorization'];
    return await this.orderService.create(createOrderDto);
  }
}
