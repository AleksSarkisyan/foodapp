import { Controller, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JoiValidationPipe } from 'src/shared/pipes/joi-validation-pipe';
import { CategoryService } from './category.service';
import { CreateCategoryDto, createCategorySchema } from './dto/create-category.dto';

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @MessagePattern({ cmd: 'createCategory' })
  @UsePipes(new JoiValidationPipe(createCategorySchema))
  create(@Payload() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }
}
