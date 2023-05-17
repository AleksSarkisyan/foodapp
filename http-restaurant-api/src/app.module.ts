import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantModule } from './restaurant/restaurant.module';
import { UserModule } from './user/user.module';
import { MenuModule } from './menu/menu.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { MenuProductModule } from './menu-product/menu-product.module';

@Module({
  imports: [RestaurantModule, UserModule, MenuModule, CategoryModule, ProductModule, MenuProductModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }
