import { Controller, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto, createRestaurantSchema } from './dto/create-restaurant.dto';
import { JoiValidationPipe } from 'src/shared/pipes/joi-validation-pipe';

@Controller()
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) { }

  @MessagePattern({ cmd: 'createRestaurant' })
  @UsePipes(new JoiValidationPipe(createRestaurantSchema))
  create(@Payload() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantService.create(createRestaurantDto);
  }

  @MessagePattern({ cmd: 'findAllRestaurant' })
  findAll() {
    return this.restaurantService.findAll();
  }

  @MessagePattern('findOneRestaurant')
  findOne(@Payload() id: number) {
    return this.restaurantService.findOne(id);
  }
}
