import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { UserAuthorizedGuard } from 'src/guards/UserAuthorizedGuard';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) { }

  @UseGuards(UserAuthorizedGuard('RESTAURANT_SERVICE'))
  @Post('/create')
  async create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return await this.restaurantService.create(createRestaurantDto);
  }

  @UseGuards(UserAuthorizedGuard('RESTAURANT_SERVICE'))
  @Get('/greet')
  async greet(): Promise<string> {
    return 'Restaurant auth works...';
  }
}
