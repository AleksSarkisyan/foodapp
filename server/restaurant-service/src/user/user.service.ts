import { CreateRestaurantUserDto } from './dto/create-restaurant-user.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) { }

  create(createRestaurantUserDto: CreateRestaurantUserDto) {
    return this.userModel.create({ ...createRestaurantUserDto });
  }

  findOne(id: number) {
    return this.userModel.findOne({
      where: {
        id,
      },
    });
  }
}
