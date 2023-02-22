import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUser } from './dto/login-user';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UserService {
  constructor(@Inject('AUTH_SERVICE') public client: ClientProxy) { }

  async create(createUserDto: CreateUserDto) {
    let message = this.client.send({ cmd: 'createUser' }, createUserDto);

    return await firstValueFrom(message);
  }

  async login(loginParams: LoginUser) {
    let message = this.client.send({ cmd: 'loginUser' }, loginParams);

    return await firstValueFrom(message);
  }
}
