import { Types, Enums } from '@asarkisyan/nestjs-foodapp-shared';
import { Controller, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JoiValidationPipe } from 'src/shared/pipes/joi-validation-pipe';
import { CategoryService } from './category.service';

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @MessagePattern({ cmd: Enums.Category.Commands.CREATE_CATEGORY })
  @UsePipes(new JoiValidationPipe(Types.Category.createCategorySchema))
  create(@Payload() createCategoryDto: Types.Category.CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }
}
