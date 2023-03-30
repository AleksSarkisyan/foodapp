import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Enums, Types } from '@asarkisyan/nestjs-foodapp-shared';


@Injectable()
export class ProductService {
  constructor(@Inject(Enums.Restaurant.Generic.SERVICE_NAME) public client: ClientProxy) { }

  async create(createProductDto: Types.Product.CreateProductDto) {
    let message = this.client.send({ cmd: Enums.Product.Commands.CREATE_PRODUCT }, createProductDto);

    return await firstValueFrom(message);
  }
}
