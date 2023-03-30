import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserService } from 'src/user/user.service';
import { Product } from './entities/product.entity';
import { Op } from 'sequelize';
import { Types } from '@asarkisyan/nestjs-foodapp-shared';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
    private userService: UserService
  ) { }
  async create(createProductDto: Types.Product.CreateProductDto) {
    let { id } = await this.userService.getUserFromToken(createProductDto.token);

    createProductDto.userId = id;

    return this.productModel.create({ ...createProductDto });
  }

  async findRestaurantProducts(findRestaurantProductsDto: Types.Product.FindRestaurantProductsDto) {
    let { restaurantUserId, productIds } = findRestaurantProductsDto;

    return this.productModel.findAll({
      attributes: ['id', 'price', 'name', 'weight', 'description'],
      where: {
        userId: restaurantUserId,
        id: {
          [Op.in]: productIds
        }
      },
    });
  }

}
