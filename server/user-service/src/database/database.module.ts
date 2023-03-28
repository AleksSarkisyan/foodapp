import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../user/entities/user.entity';
import { Enums } from '@asarkisyan/nestjs-foodapp-shared';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [
        ConfigModule.forRoot(),
      ],
      useFactory: (configService: ConfigService) => ({
        dialect: 'mysql',
        host: configService.get(Enums.User.Database.DB_HOST),
        port: +3306,
        username: configService.get(Enums.User.Database.DB_USER),
        password: configService.get(Enums.User.Database.DB_PASSWORD),
        database: configService.get(Enums.User.Database.DB_NAME),
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
