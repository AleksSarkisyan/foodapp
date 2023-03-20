import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderProductService } from './order-product.service';
import { CreateOrderProductDto } from './dto/create-order-product.dto';

@Controller()
export class OrderProductController {
  constructor(private readonly orderProductService: OrderProductService) { }

  @MessagePattern('createOrderProduct')
  create(@Payload() createOrderProductDto: CreateOrderProductDto) {
    return this.orderProductService.create(createOrderProductDto);
  }
}
