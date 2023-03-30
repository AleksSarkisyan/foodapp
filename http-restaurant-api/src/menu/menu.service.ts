import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Types, Enums } from '@asarkisyan/nestjs-foodapp-shared';


@Injectable()
export class MenuService {
  constructor(@Inject(Enums.Restaurant.Generic.SERVICE_NAME) public client: ClientProxy) { }

  async create(createMenuDto: Types.Menu.CreateMenuDto) {
    let message = this.client.send({ cmd: Enums.Menu.Commands.CREATE_MENU }, createMenuDto);

    return await firstValueFrom(message);
  }
}
