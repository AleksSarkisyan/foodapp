import { Controller, Post, Body, Headers, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { Types, Enums } from '@asarkisyan/nestjs-foodapp-shared';
import { UserAuthorizedGuard } from 'src/guards/UserAuthorizedGuard';


@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post('/create')
  @UseGuards(UserAuthorizedGuard(Enums.User.Generic.SERVICE_NAME))
  async create(@Body() createOrderDto: Types.Order.CreateOrderDto, @Headers() headers) {
    createOrderDto.token = headers['authorization'];
    return await this.orderService.create(createOrderDto);
  }
}
