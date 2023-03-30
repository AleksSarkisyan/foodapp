import { Types, Enums } from '@asarkisyan/nestjs-foodapp-shared';
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class CategoryService {
  constructor(@Inject(Enums.Restaurant.Generic.SERVICE_NAME) public client: ClientProxy) { }

  async create(createCategoryDto: Types.Category.CreateCategoryDto) {
    let message = this.client.send({ cmd: Enums.Category.Commands.CREATE_CATEGORY }, createCategoryDto);

    return await firstValueFrom(message);
  }
}
