import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ClientsModule } from '@nestjs/microservices';
import { UserCliemtModuleOptions } from 'src/shared/client-modules';


@Module({
  imports: [
    ClientsModule.register([
      UserCliemtModuleOptions
    ])
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule { }
