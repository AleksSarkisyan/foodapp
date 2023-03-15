import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { UserService } from 'src/user/user.service';
import { Op } from 'sequelize';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant)
    private restaurantModel: typeof Restaurant,
    private userService: UserService
  ) { }
  async create(createRestaurantDto: CreateRestaurantDto) {
    let { id: userId } = await this.userService.getUserFromToken(createRestaurantDto.token);
    createRestaurantDto.userId = userId;

    return this.restaurantModel.create({ ...createRestaurantDto });
  }

  async update(updateRestaurantDto: UpdateRestaurantDto) {
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
}
