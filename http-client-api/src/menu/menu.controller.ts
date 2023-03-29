import { Controller, Get, Param } from '@nestjs/common';
import { MenuService } from './menu.service';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) { }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.menuService.findOne(id);
    } catch (error) {
      return error;
    }
  }

}
