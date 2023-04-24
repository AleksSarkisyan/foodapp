import { Controller, Get, Post, Body } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) { }

  @Get('all')
  findAll() {
    try {
      return this.restaurantService.findAll();
    } catch (error) {
      return error;
    }
  }

  @Post('client-search')
  clientSearch(@Body() clientSearchDto: { location: string }) {
    try {
      return this.restaurantService.clientSearch(clientSearchDto);
    } catch (error) {
      return error;
    }
  }

}
