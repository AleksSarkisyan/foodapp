import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantUserDto } from './dto/create-restaurant-user.dto';
import { LoginUser } from 'src/user/dto/login-user';
import { UserAuthorizedGuard } from 'src/guards/UserAuthorizedGuard';
import { CreateMenuDto } from './dto/create-menu.';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

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
  @Post('/create')
  async createRestaurant(@Body() createRestaurantDto: CreateRestaurantDto) {
    return await this.restaurantService.createRestaurant(createRestaurantDto);
  }

  @Post('/menu/create')
  async createRestaurantmenu(@Body() createMenuDto: CreateMenuDto) {
    return await this.restaurantService.createMenu(createMenuDto);
  }

  @UseGuards(UserAuthorizedGuard('RESTAURANT_SERVICE'))
  @Get('/user/greet')
  async greet(): Promise<string> {
    return 'Restaurant auth works...';
  }
}
