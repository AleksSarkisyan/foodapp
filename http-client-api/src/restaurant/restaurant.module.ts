import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
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
      }
    ])
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService]
})
export class RestaurantModule { }
