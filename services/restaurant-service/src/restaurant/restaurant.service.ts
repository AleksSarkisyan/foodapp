import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Restaurant } from './entities/restaurant.entity';
import { UserService } from 'src/user/user.service';
import { Op } from 'sequelize';
import { Types } from '@asarkisyan/nestjs-foodapp-shared';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant)
    private restaurantModel: typeof Restaurant,
    private userService: UserService
  ) { }
  async create(createRestaurantDto: Types.Restaurant.CreateRestaurantDto) {
    let { id: userId } = await this.userService.getUserFromToken(createRestaurantDto.token);
    createRestaurantDto.userId = userId;

    return this.restaurantModel.create({ ...createRestaurantDto });
  }

  async update(updateRestaurantDto: Types.Restaurant.UpdateRestaurantDto) {
    let { id: userId } = await this.userService.getUserFromToken(updateRestaurantDto.token);

    return await this.restaurantModel.update(
      { ...updateRestaurantDto },
      {
        where: {
          userId,
          id: updateRestaurantDto.restaurantId
        }
      });
  }

  async findAll() {
    return this.restaurantModel.findAll({
      attributes: ['id', 'name', 'city', 'menuId'],
      where: {
        menuId: {
          [Op.not]: null
        }
      }
    });
  }

  async findOne(restaurantId: number) {
    return this.restaurantModel.findOne({
      attributes: ['userId'],
      where: {
        id: restaurantId,
      },
    });
  }
}
