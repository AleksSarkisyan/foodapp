import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class RestaurantService {
  constructor(@Inject('RESTAURANT_SERVICE') public client: ClientProxy) { }
  async findAll() {
    let message = this.client.send({ cmd: 'findAllRestaurants' }, {});

    return await firstValueFrom(message);
  }

}
