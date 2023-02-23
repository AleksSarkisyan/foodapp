import { MiddlewareConsumer, Module, NestModule, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { MikroORM } from '@mikro-orm/core';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [
    AppController,
  ],
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dbName: configService.get('DB_NAME'),
        user: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        type: 'mysql',
        autoLoadEntities: true,
        allowGlobalContext: true
      }),
    }),
  ],
  providers: [AppService, MikroOrmModule],
})
export class AppModule {

}
