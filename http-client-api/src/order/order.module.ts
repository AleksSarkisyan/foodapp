import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderGateway } from './order.gateway';
import { Enums } from '@asarkisyan/nestjs-foodapp-shared';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: Enums.Restaurant.Generic.SERVICE_NAME,
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        }
      },
      {
        name: Enums.User.Generic.SERVICE_NAME,
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        }
      }
    ])
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderGateway]
})
export class OrderModule { }
