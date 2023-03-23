import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../user/entities/user.entity';

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
        models: [User],
      }),
      inject: [ConfigService],
    }),
  ]
})
export class DatabaseModule { }
