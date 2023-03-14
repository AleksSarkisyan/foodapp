import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserService } from 'src/user/user.service';
import { CreateMenuProductDto } from './dto/create-menu-product.dto';
import { MenuProduct } from './entities/menu-product.entity';

@Injectable()
export class MenuProductService {
  constructor(
    @InjectModel(MenuProduct)
    private menuProductModel: typeof MenuProduct,
    private userService: UserService
  ) { }
  async create(createMenuProductDto: CreateMenuProductDto) {
    let { id: userId } = await this.userService.getUserFromToken(createMenuProductDto.token);
    createMenuProductDto.userId = userId;

    // To do -Validate if product and menu belong to this user
    return this.menuProductModel.create({ ...createMenuProductDto });
  }
}
