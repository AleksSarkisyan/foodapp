import { Controller, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MenuProductService } from './menu-product.service';
import { JoiValidationPipe } from 'src/shared/pipes/joi-validation-pipe';
import { Types, Enums } from '@asarkisyan/nestjs-foodapp-shared';


@Controller()
export class MenuProductController {
  constructor(private readonly menuProductService: MenuProductService) { }

  @MessagePattern({ cmd: Enums.MenuProduct.Commands.CREATE_MENU_PRODUCT })
  @UsePipes(new JoiValidationPipe(Types.MenuProduct.createMenuProductSchema))
  create(@Payload() createMenuProductDto: Types.MenuProduct.CreateMenuProductDto) {
    return this.menuProductService.create(createMenuProductDto);
  }
}
