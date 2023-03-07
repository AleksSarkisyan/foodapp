import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(@Inject('RESTAURANT_SERVICE') public client: ClientProxy) { }

  async create(createRestaurantDto: CreateRestaurantDto) {
    let message = this.client.send({ cmd: 'createRestaurant' }, createRestaurantDto);

    return await firstValueFrom(message);
  }

  async update(updateRestaurantDto: UpdateRestaurantDto) {
    let message = this.client.send({ cmd: 'updateRestaurant' }, updateRestaurantDto);

    return await firstValueFrom(message);
  }
}
