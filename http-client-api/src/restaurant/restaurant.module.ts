import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { ClientsModule } from '@nestjs/microservices';
import { RestaurantClientModuleOptions } from 'src/shared/client-modules';


@Module({
  imports: [
    ClientsModule.register([
      RestaurantClientModuleOptions
    ])
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService]
})
export class RestaurantModule { }
