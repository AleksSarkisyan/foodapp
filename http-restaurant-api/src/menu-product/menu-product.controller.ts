import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Headers } from '@nestjs/common';
import { MenuProductService } from './menu-product.service';
import { CreateMenuProductDto } from './dto/create-menu-product.dto';
import { UserAuthorizedGuard } from 'src/guards/UserAuthorizedGuard';

@Controller('menu-product')
export class MenuProductController {
  constructor(private readonly menuProductService: MenuProductService) { }

  @UseGuards(UserAuthorizedGuard('RESTAURANT_SERVICE'))
  @Post('/create')
  async createMenuProduct(@Body() createMenuProductDto: CreateMenuProductDto, @Headers() headers) {
    createMenuProductDto.token = headers['authorization'];
    return await this.menuProductService.create(createMenuProductDto);
  }
}
