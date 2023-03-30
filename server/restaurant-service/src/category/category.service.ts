import { Types, Enums } from '@asarkisyan/nestjs-foodapp-shared';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './entities/category.entity';


@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category)
    private categoryModel: typeof Category,
  ) { }

  create(createCategoryDto: Types.Category.CreateCategoryDto) {
    return this.categoryModel.create({ ...createCategoryDto });
  }

  findAll() {
    return this.categoryModel.findAll();
  }

}
