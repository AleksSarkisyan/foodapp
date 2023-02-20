// import { Module } from '@nestjs/common';
// import { UserService } from './user.service';
// import { UserController } from './user.controller';
// import { UserRepository } from './user.repository';

// @Module({
//   controllers: [UserController],
//   providers: [UserService],
//   imports: [UserRepository]
// })
// export class UserModule { }

import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserRepository } from './user.repository';

@Module({
  controllers: [
    UserController,
  ],
  exports: [UserService],
  imports: [MikroOrmModule.forFeature({ entities: [User] })],
  providers: [UserService],
})

export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {

  }
}


