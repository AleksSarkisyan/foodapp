import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { LocalStrategy } from './local.strategy';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
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
    }),
  ],
  providers: [UserService, JwtModule, LocalStrategy],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule { }