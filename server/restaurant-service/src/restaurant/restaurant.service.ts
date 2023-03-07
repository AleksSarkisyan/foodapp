import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant)
    private restaurantModel: typeof Restaurant,
    private readonly jwtService: JwtService,
  ) { }
  create(createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantModel.create({ ...createRestaurantDto });
  }

  async update(updateRestaurantDto: UpdateRestaurantDto) {
    let tokenData = this.jwtService.decode(updateRestaurantDto.token);
    let userData = tokenData['user'];
    let email = userData.email;

    const user = await this.restaurantModel.findOne(email);
    const userId = user.userId;

    return await this.restaurantModel.update({ ...updateRestaurantDto }, { where: { userId, id: updateRestaurantDto.restaurantId } });
  }

  findAll() {
    return `This action returns all restaurant`;
  }

  findOne(id: number) {
    return `This action returns a #${id} restaurant`;
  }
}
