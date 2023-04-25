import { Types, Enums } from '@asarkisyan/nestjs-foodapp-shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class RestaurantService {
  constructor(@Inject(Enums.Restaurant.Generic.SERVICE_NAME) public client: ClientProxy) { }

  async create(createRestaurantDto: Types.Restaurant.CreateRestaurantDto) {
    let message = this.client.send({ cmd: Enums.Restaurant.Commands.CREATE_RESTAURANT }, createRestaurantDto);

    return await firstValueFrom(message);
  }

  async update(updateRestaurantDto: Types.Restaurant.UpdateRestaurantDto) {
    let message = this.client.send({ cmd: Enums.Restaurant.Commands.UPDATE_RESTAURANT }, updateRestaurantDto);

    return await firstValueFrom(message);
  }

  async getRestaurantsByUserId(getRestaurantsByUserIdDto: { token: string }) {
    let message = this.client.send({ cmd: 'getRestaurantsByUserId' }, getRestaurantsByUserIdDto);

    return await firstValueFrom(message);
  }
}
