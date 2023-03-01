import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { LoginUser } from 'src/user/dto/login-user';
import { CreateRestaurantUserDto } from './dto/create-restaurant-user.dto';

@Injectable()
export class RestaurantService {
  constructor(@Inject('RESTAURANT_SERVICE') public client: ClientProxy) { }

  async create(createRestaurantUserDto: CreateRestaurantUserDto) {
    let message = this.client.send({ cmd: 'createRestaurantUser' }, createRestaurantUserDto);

    return await firstValueFrom(message);
  }

  async login(loginParams: LoginUser) {
    let message = this.client.send({ cmd: 'loginRestaurantUser' }, loginParams);

    return await firstValueFrom(message);
  }
}
