import { Controller, Post, Body, UseGuards, Headers } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { UserAuthorizedGuard } from 'src/guards/UserAuthorizedGuard';
import { Types, Enums } from '@asarkisyan/nestjs-foodapp-shared';


@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) { }

  @UseGuards(UserAuthorizedGuard(Enums.Restaurant.Generic.SERVICE_NAME))
  @Post('/create')
  async create(@Body() createRestaurantDto: Types.Restaurant.CreateRestaurantDto, @Headers() headers) {
    createRestaurantDto.token = headers['authorization'];
    return await this.restaurantService.create(createRestaurantDto);
  }

  @UseGuards(UserAuthorizedGuard(Enums.Restaurant.Generic.SERVICE_NAME))
  @Post('/update')
  async update(@Body() updateRestaurantDto: Types.Restaurant.UpdateRestaurantDto, @Headers() headers): Promise<string> {
    updateRestaurantDto.token = headers['authorization'];
    return await this.restaurantService.update(updateRestaurantDto);
  }
}
