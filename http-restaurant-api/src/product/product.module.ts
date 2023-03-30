import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RestaurantClientModuleOptions } from 'shared/client-modules';


@Module({
  imports: [
    ClientsModule.register([
      RestaurantClientModuleOptions
    ])
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductModule { }
