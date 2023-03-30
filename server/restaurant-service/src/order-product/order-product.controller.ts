import { Types, Enums } from '@asarkisyan/nestjs-foodapp-shared';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderProductService } from './order-product.service';


@Controller()
export class OrderProductController {
  constructor(private readonly orderProductService: OrderProductService) { }

  @MessagePattern(Enums.OrderProduct.Commands.CREATE_ORDER_PRODUCT)
  create(@Payload() createOrderProductDto: Types.OrderProduct.CreateOrderProductDto) {
    return this.orderProductService.create(createOrderProductDto);
  }
}
