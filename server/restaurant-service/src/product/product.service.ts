import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CreateProductDto, FindRestaurantProductsDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { Op } from 'sequelize';


@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
    private userService: UserService
  ) { }
  async create(createProductDto: CreateProductDto) {
    let { id } = await this.userService.getUserFromToken(createProductDto.token);

    createProductDto.userId = id;

    return this.productModel.create({ ...createProductDto });
  }

  async findRestaurantProducts(findRestaurantProductsDto: FindRestaurantProductsDto) {
    let { restaurantUserId, productIds } = findRestaurantProductsDto;

    return this.productModel.findAll({
      attributes: ['id', 'price'],
      where: {
        userId: restaurantUserId,
        id: {
          [Op.in]: productIds
        }
      },
    });
  }

}
