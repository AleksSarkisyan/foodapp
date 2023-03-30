import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { UserAuthorizedGuard } from 'src/guards/UserAuthorizedGuard';
import { Types, Enums } from '@asarkisyan/nestjs-foodapp-shared';


@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) { }

  @UseGuards(UserAuthorizedGuard(Enums.Restaurant.Generic.SERVICE_NAME))
  @Post('/create')
  async create(@Body() createMenuDto: Types.Menu.CreateMenuDto) {
    return await this.menuService.create(createMenuDto);
  }
}
