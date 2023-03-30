import { Types, Enums } from '@asarkisyan/nestjs-foodapp-shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class MenuProductService {
  constructor(@Inject(Enums.Restaurant.Generic.SERVICE_NAME) public client: ClientProxy) { }

  async create(createMenuProductDto: Types.MenuProduct.CreateMenuProductDto) {
    let message = this.client.send({ cmd: Enums.MenuProduct.Commands.CREATE_MENU_PRODUCT }, createMenuProductDto);

    return await firstValueFrom(message);
  }

}
