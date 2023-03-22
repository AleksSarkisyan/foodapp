import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';

@Module({
  controllers: [
    UserController,
  ],
  exports: [UserService],
  imports: [
    SequelizeModule.forFeature([User]),
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
  providers: [UserService, LocalStrategy],
})

export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {

  }
}


