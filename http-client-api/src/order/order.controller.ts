import { Controller, Get } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Get("/orders")
  async orders() {
    return await this.orderService.getOrders();
  }


}
