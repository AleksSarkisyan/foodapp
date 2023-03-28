import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Enums } from '@asarkisyan/nestjs-foodapp-shared';


@Injectable()
export class RestaurantService {
  constructor(@Inject(Enums.Restaurant.Generic.SERVICE_NAME) public client: ClientProxy) { }
  async findAll() {
    let message = this.client.send({ cmd: Enums.Restaurant.Commands.FIND_ALL_RESTAURANTS }, {});

    return await firstValueFrom(message);
  }

}
