import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateMenuDto } from './dto/create-menu.dto';

@Injectable()
export class MenuService {
  constructor(@Inject('RESTAURANT_SERVICE') public client: ClientProxy) { }

  async create(createMenuDto: CreateMenuDto) {
    console.log('createMenuDto is', createMenuDto)
    let message = this.client.send({ cmd: 'createMenu' }, createMenuDto);

    return await firstValueFrom(message);
  }
}
