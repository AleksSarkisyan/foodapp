import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Menu } from './entities/menu.entity';
import { Product } from 'src/product/entities/product.entity';
import { MenuProduct } from 'src/menu-product/entities/menu-product.entity';
import { CategoryService } from 'src/category/category.service';
import sequelize, { Sequelize } from 'sequelize';
import { FindMenuDto, findMenuMenuSchema } from './dto/find-menu.dto';



@Injectable()
export class MenuService {
  constructor(
    @InjectModel(Menu)
    private menuModel: typeof Menu,
    private categoryService: CategoryService
  ) { }
  create(createMenuDto: CreateMenuDto) {
    return this.menuModel.create({ ...createMenuDto });
  }

  async findOne(findMenuDto: FindMenuDto) {
    let allCategories = await this.categoryService.findAll();

    let { menuId } = findMenuDto;
    let data = [];

    for (const [key, category] of Object.entries(allCategories)) {
      let [results, metadata] = await Menu.sequelize.query(`
        SELECT restaurants.id as restaurant_id,
        restaurants.menu_id as menu_id,
        menus.name as menu_name,
        menus_products.menu_id,
        menus_products.product_id,
        products.*,
        menus.id
        FROM menus
        JOIN restaurants ON restaurants.menu_id = menus.id
        JOIN menus_products ON menus_products.menu_id = menus.id
        JOIN products ON products.id = menus_products.product_id
        JOIN categories ON categories.id = products.category_id
        WHERE restaurants.id = ${menuId} AND categories.id = ${category.id}
      `);

      if (results.length) {
        data.push({ [category.name]: results });
      }
    }

    return data;
  }
}
