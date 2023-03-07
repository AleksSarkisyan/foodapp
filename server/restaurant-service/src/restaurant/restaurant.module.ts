import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Restaurant } from './entities/restaurant.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forFeature([Restaurant]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        privateKey: configService.get<string>('JWT_PRIVATE_KEY'),
        signOptions: { expiresIn: '900s' }
      }),
      inject: [ConfigService],
    })
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports: [RestaurantService]
})
export class RestaurantModule { }
