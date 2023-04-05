import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ClientsModule } from '@nestjs/microservices';
import { RestaurantClientModuleOptions, PaymentCliemtModuleOptions } from 'shared/client-modules';


@Module({
  imports: [
    ClientsModule.register([
      RestaurantClientModuleOptions,
      PaymentCliemtModuleOptions
    ])
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductModule { }
