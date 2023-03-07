import { Controller, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto, createRestaurantSchema } from './dto/create-restaurant.dto';
import { JoiValidationPipe } from 'src/shared/pipes/joi-validation-pipe';
import { UpdateRestaurantDto, updateRestaurantSchema } from './dto/update-restaurant.dto';

@Controller()
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) { }

  @MessagePattern({ cmd: 'createRestaurant' })
  @UsePipes(new JoiValidationPipe(createRestaurantSchema))
  create(@Payload() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantService.create(createRestaurantDto);
  }

  @MessagePattern({ cmd: 'updateRestaurant' })
  @UsePipes(new JoiValidationPipe(updateRestaurantSchema))
  update(@Payload() updateRestaurantDto: UpdateRestaurantDto) {
    return this.restaurantService.update(updateRestaurantDto);
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
