import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from './user.repository';
import { MikroORM } from '@mikro-orm/mysql';


@Module({
  controllers: [
    UserController,
  ],
  exports: [UserService],
  imports: [
    MikroOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'rgregre',
      privateKey: 'pessho',
      signOptions: { expiresIn: '900s' },
    }),
    UserRepository
  ],
  providers: [UserService, LocalStrategy, UserRepository],
})

export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {

  }
}


