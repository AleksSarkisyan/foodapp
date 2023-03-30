import { Controller, Get, Post, Body, UseGuards, Headers } from '@nestjs/common';
import { MenuProductService } from './menu-product.service';
import { UserAuthorizedGuard } from 'src/guards/UserAuthorizedGuard';
import { Enums, Types } from '@asarkisyan/nestjs-foodapp-shared';


@Controller('menu-product')
export class MenuProductController {
  constructor(private readonly menuProductService: MenuProductService) { }

  @UseGuards(UserAuthorizedGuard(Enums.Restaurant.Generic.SERVICE_NAME))
  @Post('/create')
  async createMenuProduct(@Body() createMenuProductDto: Types.MenuProduct.CreateMenuProductDto, @Headers() headers) {
    createMenuProductDto.token = headers['authorization'];
    return await this.menuProductService.create(createMenuProductDto);
  }
}
