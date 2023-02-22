import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
@Module({
  controllers: [
    UserController,
  ],
  exports: [UserService],
  imports: [
    MikroOrmModule.forRoot({
      entities: [User],
      dbName: 'auth_service',
      type: 'mysql',
      user: 'root',
      password: 'root',
      allowGlobalContext: true
    }),
    MikroOrmModule.forFeature({ entities: [User] }),
    JwtModule.register({
      secret: 'rgregre',
      privateKey: 'pessho',
      signOptions: { expiresIn: '900s' },
    })
  ],
  providers: [UserService, LocalStrategy],
})

export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {

  }
}


