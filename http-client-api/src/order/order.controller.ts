import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { OrderService } from './order.service';
import { Types } from '@asarkisyan/nestjs-foodapp-shared';


@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post('/create')
  async create(@Body() createOrderDto: Types.Order.CreateOrderDto, @Headers() headers) {
    createOrderDto.token = headers['authorization'];
    /** 1 get restaurantId,productIds, quantity from client
     *  2  Send message to restaurant service check if restaurantId and productIds match (productIds belong to this restaurantId)
     *  3 If all good get product details for each product
     *  4 Make payment (to do later)
     *  5 Write to orders tables
     *  6 WS for restaurants that a new order was created
     * 
    */
    return await this.orderService.create(createOrderDto);
  }


}
