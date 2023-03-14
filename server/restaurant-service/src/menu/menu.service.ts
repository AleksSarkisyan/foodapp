import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Menu } from './entities/menu.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(Menu)
    private menuModel: typeof Menu
  ) { }
  create(createMenuDto: CreateMenuDto) {
    return this.menuModel.create({ ...createMenuDto });
  }
}
