import { Types } from '@asarkisyan/nestjs-foodapp-shared';
import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('/create')
  async create(@Body() createRestaurantUserDto: Types.RestaurantUser.CreateRestaurantUserDto) {
    return await this.userService.create(createRestaurantUserDto);
  }

  @Post('/login')
  async login(@Body() loginUserDto: Types.User.LoginUser) {
    return await this.userService.login(loginUserDto);
  }
}
