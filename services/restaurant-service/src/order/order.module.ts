import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './entities/order.entity';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';
import { OrderProductModule } from 'src/order-product/order-product.module';


@Module({
  imports: [
    OrderProductModule,
    RestaurantModule,
    ProductModule,
    UserModule,
    SequelizeModule.forFeature([Order]),
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule { }
