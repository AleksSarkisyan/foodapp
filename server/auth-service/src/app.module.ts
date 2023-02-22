import { MiddlewareConsumer, Module, NestModule, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { MikroORM } from '@mikro-orm/core';

@Module({
  controllers: [
    AppController,
  ],
  imports: [
    UserModule,
  ],
  providers: [AppService],
})
export class AppModule implements NestModule, OnModuleInit {

  constructor(private readonly orm: MikroORM) { }

  async onModuleInit(): Promise<void> {
    console.log('init...');
    // await this.orm.getMigrator().up();
  }

  configure(consumer: MiddlewareConsumer) {

  }

}
