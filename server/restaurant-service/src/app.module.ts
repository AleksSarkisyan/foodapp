import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user/entities/user.entity';
import { Menu } from './menu/entities/menu.entity';
import { LocalStrategy } from './user/local.strategy';
import { MenuModule } from './menu/menu.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { Restaurant } from './restaurant/entities/restaurant.entity';
import { CategoryModule } from './category/category.module';
import { Category } from './category/entities/category.entity';
import { ProductModule } from './product/product.module';
import { Product } from './product/entities/product.entity';
import { MenuProductModule } from './menu-product/menu-product.module';
import { MenuProduct } from './menu-product/entities/menu-product.entity';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [
        ConfigModule.forRoot(),
      ],
      useFactory: (configService: ConfigService) => ({
        dialect: 'mysql',
        host: configService.get('DB_HOST'),
        port: +3306,
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        define: {
          timestamps: true,
          underscored: true
        },
        models: [User, Menu, Restaurant, Category, Product, MenuProduct],
      }),
      inject: [ConfigService],
    }),
    UserModule,
    MenuModule,
    RestaurantModule,
    CategoryModule,
    ProductModule,
    MenuProductModule],
  controllers: [AppController],
  providers: [AppService, LocalStrategy],
})
export class AppModule { }
