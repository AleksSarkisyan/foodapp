import { Module } from '@nestjs/common';
import { MenuProductService } from './menu-product.service';
import { MenuProductController } from './menu-product.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RestaurantClientModuleOptions } from 'shared/client-modules';



@Module({
  imports: [
    ClientsModule.register([
      RestaurantClientModuleOptions
    ])
  ],
  controllers: [MenuProductController],
  providers: [MenuProductService],
  exports: [MenuProductService]
})
export class MenuProductModule { }
