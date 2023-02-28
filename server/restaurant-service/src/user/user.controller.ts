import { Controller, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateRestaurantUserDto, createRestaurantUserSchema } from './dto/create-restaurant-user.dto';
import { JoiValidationPipe } from 'src/shared/pipes/joi-validation-pipe';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @MessagePattern({ cmd: 'createRestaurantUser' })
  @UsePipes(new JoiValidationPipe(createRestaurantUserSchema))
  create(@Payload() createRestaurantUserDto: CreateRestaurantUserDto) {
    return this.userService.create(createRestaurantUserDto);
  }

  @MessagePattern('findOneUser')
  findOne(@Payload() id: number) {
    return this.userService.findOne(id);
  }
}
