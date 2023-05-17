import { Types, Enums } from '@asarkisyan/nestjs-foodapp-shared';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @MessagePattern({ cmd: Enums.Order.Commands.CREATE_ORDER })
  create(@Payload() createOrderDto: Types.Order.CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @MessagePattern({ cmd: Enums.Product.Commands.GET_ORDER_PRODUCT_DETAIL })
  getProductOrderDetails(@Payload() createOrderDto: Types.Order.CreateOrderDto) {
    return this.orderService.getProductOrderDetails(createOrderDto);
  }

  @MessagePattern({ cmd: 'getLastUserOrder' })
  getLastUserOrder(@Payload() getLastUserOrderDto: { userId: number }) {
    return this.orderService.getLastUserOrder(getLastUserOrderDto);
  }

  @MessagePattern({ cmd: 'updateOrderStatus' })
  updateOrderStatus(@Payload() updateOrderStatusDto: { orderId: number, status: string }) {
    return this.orderService.updateOrderStatus(updateOrderStatusDto);
  }



}
