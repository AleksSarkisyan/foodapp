import { Enums, Types } from '@asarkisyan/nestjs-foodapp-shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(@Inject('USER_SERVICE') public client: ClientProxy) { }

  async create(createUserDto: Types.User.CreateUserDto) {
    let message = this.client.send({ cmd: Enums.User.Commands.CREATE_USER }, createUserDto);

    return await firstValueFrom(message);
  }

  async login(loginParams: Types.User.LoginUser) {
    let message = this.client.send({ cmd: Enums.User.Commands.LOGIN_USER }, loginParams);

    return await firstValueFrom(message);
  }
}
