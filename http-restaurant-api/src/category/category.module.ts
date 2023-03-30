import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { ClientsModule } from '@nestjs/microservices';
import { RestaurantClientModuleOptions } from 'shared/client-modules';

@Module({
  imports: [
    ClientsModule.register([
      RestaurantClientModuleOptions
    ])
  ],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule { }
