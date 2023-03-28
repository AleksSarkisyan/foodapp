import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Enums } from '@asarkisyan/nestjs-foodapp-shared';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: Enums.User.Generic.SERVICE_NAME,
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        }
      }
    ])
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule { }
