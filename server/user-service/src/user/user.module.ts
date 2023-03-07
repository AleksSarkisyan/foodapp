import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserRepository } from './user.repository';


@Module({
  controllers: [
    UserController,
  ],
  exports: [UserService],
  imports: [
    MikroOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        privateKey: configService.get<string>('JWT_PRIVATE_KEY'),
        signOptions: { expiresIn: '900s' }
      }),
      inject: [ConfigService],
    }),
    UserRepository
  ],
  providers: [UserService, LocalStrategy, UserRepository],
})

export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {

  }
}


