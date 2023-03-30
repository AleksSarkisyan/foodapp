import { Enums } from '@asarkisyan/nestjs-foodapp-shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class MenuService {
  constructor(@Inject(Enums.Restaurant.Generic.SERVICE_NAME) public client: ClientProxy) { }

  async findOne(id: string) {
    let message = this.client.send({ cmd: Enums.Menu.Commands.FIND_RESTAURANT_MENU }, { restaurantId: id });

    return await firstValueFrom(message);
  }
}
