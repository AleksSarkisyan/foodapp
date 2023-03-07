import { Controller, Get, Post, Body, UseGuards, Headers } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { UserAuthorizedGuard } from 'src/guards/UserAuthorizedGuard';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) { }

  @UseGuards(UserAuthorizedGuard('RESTAURANT_SERVICE'))
  @Post('/create')
  async create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return await this.restaurantService.create(createRestaurantDto);
  }

  @UseGuards(UserAuthorizedGuard('RESTAURANT_SERVICE'))
  @Post('/update')
  async update(@Body() updateRestaurantDto: UpdateRestaurantDto, @Headers() headers): Promise<string> {
    updateRestaurantDto.token = headers['authorization'];
    return await this.restaurantService.update(updateRestaurantDto);
  }
}
