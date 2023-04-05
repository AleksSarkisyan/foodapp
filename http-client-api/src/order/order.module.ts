import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ClientsModule } from '@nestjs/microservices';
import { OrderGateway } from './order.gateway';
import { RestaurantClientModuleOptions, UserCliemtModuleOptions, PaymentCliemtModuleOptions } from 'src/shared/client-modules';

@Module({
  imports: [
    ClientsModule.register([
      RestaurantClientModuleOptions,
      UserCliemtModuleOptions,
      PaymentCliemtModuleOptions
    ])
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderGateway]
})
export class OrderModule { }
