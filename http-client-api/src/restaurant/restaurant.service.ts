import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateRestaurantUserDto } from './dto/create-restaurant-user.dto';

@Injectable()
export class RestaurantService {
  constructor(@Inject('RESTAURANT_SERVICE') public client: ClientProxy) { }

  async create(createRestaurantUserDto: CreateRestaurantUserDto) {
    let message = this.client.send({ cmd: 'createRestaurantUser' }, createRestaurantUserDto);

    return await firstValueFrom(message);
  }


}
