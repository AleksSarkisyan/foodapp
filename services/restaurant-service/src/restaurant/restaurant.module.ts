import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Restaurant } from './entities/restaurant.entity';
import { UserModule } from 'src/user/user.module';
import { MapquestModule } from 'src/mapquest/mapquest.module';

@Module({
  imports: [
    UserModule,
    MapquestModule,
    SequelizeModule.forFeature([Restaurant])
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports: [RestaurantService]
})
export class RestaurantModule { }
