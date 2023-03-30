import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { UserAuthorizedGuard } from 'src/guards/UserAuthorizedGuard';
import { Types, Enums } from '@asarkisyan/nestjs-foodapp-shared';


@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @UseGuards(UserAuthorizedGuard(Enums.Restaurant.Generic.SERVICE_NAME))
  @Post('/create')
  create(@Body() createCategoryDto: Types.Category.CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }
}
