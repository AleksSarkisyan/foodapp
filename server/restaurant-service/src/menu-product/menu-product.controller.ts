import { Controller, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MenuProductService } from './menu-product.service';
import { CreateMenuProductDto, createMenuProductSchema } from './dto/create-menu-product.dto';
import { JoiValidationPipe } from 'src/shared/pipes/joi-validation-pipe';

@Controller()
export class MenuProductController {
  constructor(private readonly menuProductService: MenuProductService) { }

  @MessagePattern({ cmd: 'createMenuProduct' })
  @UsePipes(new JoiValidationPipe(createMenuProductSchema))
  create(@Payload() createMenuProductDto: CreateMenuProductDto) {
    return this.menuProductService.create(createMenuProductDto);
  }
}
