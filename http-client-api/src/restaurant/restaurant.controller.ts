import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantUserDto } from './dto/create-restaurant-user.dto';
import { LoginUser } from 'src/user/dto/login-user';
import { UserAuthorizedGuard } from 'src/guards/UserAuthorizedGuard';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) { }

  @Post('/user/create')
  async create(@Body() createRestaurantUserDto: CreateRestaurantUserDto) {
    return await this.restaurantService.create(createRestaurantUserDto);
  }

  @Post('/user/login')
  async login(@Body() loginUserDto: LoginUser) {
    return await this.restaurantService.login(loginUserDto);
  }

  @UseGuards(UserAuthorizedGuard('RESTAURANT_SERVICE'))
  @Get('/user/greet')
  async greet(): Promise<string> {
    return 'Restaurant auth works...';
  }
}
