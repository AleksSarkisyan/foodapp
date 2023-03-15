import { Controller, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MenuService } from './menu.service';
import { CreateMenuDto, createMenuSchema } from './dto/create-menu.dto';
import { FindMenuDto, findMenuMenuSchema } from './dto/find-menu.dto';
import { JoiValidationPipe } from 'src/shared/pipes/joi-validation-pipe';

@Controller()
export class MenuController {
  constructor(private readonly menuService: MenuService) { }

  @MessagePattern({ cmd: 'createMenu' })
  @UsePipes(new JoiValidationPipe(createMenuSchema))
  create(@Payload() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @MessagePattern({ cmd: 'findRestaurantMenu' })
  @UsePipes(new JoiValidationPipe(findMenuMenuSchema))
  async findOne(@Payload() findMenuDto: FindMenuDto) {
    let result = await this.menuService.findOne(findMenuDto);

    return result;
  }
}
