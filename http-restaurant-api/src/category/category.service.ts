import { Injectable, Inject } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CategoryService {
  constructor(@Inject('RESTAURANT_SERVICE') public client: ClientProxy) { }

  async create(createCategoryDto: CreateCategoryDto) {
    let message = this.client.send({ cmd: 'createCategory' }, createCategoryDto);

    return await firstValueFrom(message);
  }
}
