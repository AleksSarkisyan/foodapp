import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MenuService {
  constructor(@Inject('RESTAURANT_SERVICE') public client: ClientProxy) { }

  async findOne(id: string) {
    let message = this.client.send({ cmd: 'findRestaurantMenu' }, { menuId: id });

    return await firstValueFrom(message);
  }
}
