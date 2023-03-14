import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateMenuProductDto } from './dto/create-menu-product.dto';

@Injectable()
export class MenuProductService {
  constructor(@Inject('RESTAURANT_SERVICE') public client: ClientProxy) { }

  async create(createMenuProductDto: CreateMenuProductDto) {
    let message = this.client.send({ cmd: 'createMenuProduct' }, createMenuProductDto);

    return await firstValueFrom(message);
  }

}
