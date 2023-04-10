import { Controller, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MenuService } from './menu.service';
import { JoiValidationPipe } from 'src/shared/pipes/joi-validation-pipe';
import { Types, Enums } from '@asarkisyan/nestjs-foodapp-shared';

@Controller()
export class MenuController {
  constructor(private readonly menuService: MenuService) { }

  @MessagePattern({ cmd: Enums.Menu.Commands.CREATE_MENU })
  @UsePipes(new JoiValidationPipe(Types.Menu.createMenuSchema))
  create(@Payload() createMenuDto: Types.Menu.CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @MessagePattern({ cmd: Enums.Menu.Commands.FIND_RESTAURANT_MENU })
  @UsePipes(new JoiValidationPipe(Types.Menu.findMenuMenuSchema))
  async findOne(@Payload() findMenuDto: Types.Menu.FindMenuDto) {
    let result = await this.menuService.findOne(findMenuDto);

    return result;
  }
}
