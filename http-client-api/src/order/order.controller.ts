import { Controller, Get } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Get("/orders")
  async orders() {
    console.log('in orders route...')
    let message = await this.orderService.getOrders();

    //console.log('got mess ==', message)
    return message;
  }


}
