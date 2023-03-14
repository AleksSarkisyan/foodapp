import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateRestaurantUserDto } from './dto/create-restaurant-user.dto';
import { LoginUser } from './dto/login-user';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('/create')
  async create(@Body() createRestaurantUserDto: CreateRestaurantUserDto) {
    return await this.userService.create(createRestaurantUserDto);
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUser) {
    return await this.userService.login(loginUserDto);
  }
}
