import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantUserDto } from './dto/create-restaurant-user.dto';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) { }

  @Post('/user/create')
  async create(@Body() createRestaurantUserDto: CreateRestaurantUserDto) {
    return await this.restaurantService.create(createRestaurantUserDto);
  }
}
