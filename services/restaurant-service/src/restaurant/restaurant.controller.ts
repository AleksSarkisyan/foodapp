import { Controller, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RestaurantService } from './restaurant.service';
import { JoiValidationPipe } from 'src/shared/pipes/joi-validation-pipe';
import { Types, Enums } from '@asarkisyan/nestjs-foodapp-shared';

const { CREATE_RESTAURANT, UPDATE_RESTAURANT, FIND_ALL_RESTAURANTS } = Enums.Restaurant.Commands

@Controller()
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) { }

  @MessagePattern({ cmd: CREATE_RESTAURANT })
  @UsePipes(new JoiValidationPipe(Types.Restaurant.createRestaurantSchema))
  create(@Payload() createRestaurantDto: Types.Restaurant.CreateRestaurantDto) {
    return this.restaurantService.create(createRestaurantDto);
  }

  @MessagePattern({ cmd: UPDATE_RESTAURANT })
  @UsePipes(new JoiValidationPipe(Types.Restaurant.updateRestaurantSchema))
  update(@Payload() updateRestaurantDto: Types.Restaurant.UpdateRestaurantDto) {
    return this.restaurantService.update(updateRestaurantDto);
  }

  @MessagePattern({ cmd: FIND_ALL_RESTAURANTS })
  findAll() {
    return this.restaurantService.findAll();
  }

  @MessagePattern({ cmd: 'client-search' })
  clientSearch(@Payload() clientSearchDto: { location: string }) {
    return this.restaurantService.clientSearch(clientSearchDto);
  }

  @MessagePattern({ cmd: 'getRestaurantsByUserId' })
  getRestaurantsByUserId(@Payload() getRestaurantsByUserIdDto: { token: string }) {
    return this.restaurantService.getRestaurantsByUserId(getRestaurantsByUserIdDto);
  }
}
