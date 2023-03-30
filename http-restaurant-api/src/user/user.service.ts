import { Enums, Types } from '@asarkisyan/nestjs-foodapp-shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(@Inject(Enums.Restaurant.Generic.SERVICE_NAME) public client: ClientProxy) { }

  async create(createRestaurantUserDto: Types.RestaurantUser.CreateRestaurantUserDto) {
    let message = this.client.send({ cmd: Enums.RestaurantUser.Commands.CREATE_RESTAURANT_USER }, createRestaurantUserDto);

    return await firstValueFrom(message);
  }

  async login(loginParams: Types.User.LoginUser) {
    let message = this.client.send({ cmd: Enums.RestaurantUser.Commands.LOGIN_RESTAURANT_USER }, loginParams);

    return await firstValueFrom(message);
  }
}
