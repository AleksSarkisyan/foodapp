import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Menu } from './entities/menu.entity';
import { CategoryService } from 'src/category/category.service';
import { Types } from '@asarkisyan/nestjs-foodapp-shared';


@Injectable()
export class MenuService {
  constructor(
    @InjectModel(Menu)
    private menuModel: typeof Menu,
    private categoryService: CategoryService
  ) { }
  create(createMenuDto: Types.Menu.CreateMenuDto) {
    return this.menuModel.create({ ...createMenuDto });
  }

  async findOne(findMenuDto: Types.Menu.FindMenuDto) {
    let allCategories = await this.categoryService.findAll();

    let { restaurantId } = findMenuDto;
    let data = [];

    for (const [key, category] of Object.entries(allCategories)) {
      let [results, metadata] = await Menu.sequelize.query(`
        SELECT restaurants.id as restaurant_id,
        restaurants.menu_id as menu_id,
        menus.name as menu_name,
        menus_products.menu_id,
        menus_products.product_id as productId,
        products.*,
        menus.id
        FROM menus
        JOIN restaurants ON restaurants.menu_id = menus.id
        JOIN menus_products ON menus_products.menu_id = menus.id
        JOIN products ON products.id = menus_products.product_id
        JOIN categories ON categories.id = products.category_id
        WHERE restaurants.id = ${restaurantId} AND categories.id = ${category.id}
      `);

      if (results.length) {
        data.push({
          categoryName: category.name,
          products: results
        })
      }
    }

    return data;
  }
}
