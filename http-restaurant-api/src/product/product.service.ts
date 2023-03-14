import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(@Inject('RESTAURANT_SERVICE') public client: ClientProxy) { }

  async create(createProductDto: CreateProductDto) {
    let message = this.client.send({ cmd: 'createProduct' }, createProductDto);

    return await firstValueFrom(message);
  }
}
