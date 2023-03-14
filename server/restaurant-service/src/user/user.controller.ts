import { Controller, Logger, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateRestaurantUserDto, createRestaurantUserSchema } from './dto/create-restaurant-user.dto';
import { JoiValidationPipe } from 'src/shared/pipes/joi-validation-pipe';
import { LocalStrategy } from './local.strategy';
import { LoginUser } from './dto/login-user';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService, private readonly localStrategy: LocalStrategy) { }

  @MessagePattern({ cmd: 'createRestaurantUser' })
  @UsePipes(new JoiValidationPipe(createRestaurantUserSchema))
  async create(@Payload() createRestaurantUserDto: CreateRestaurantUserDto) {
    let user = await this.userService.create(createRestaurantUserDto);
    let shouldLogin = await this.localStrategy.validate(user.email, user.password);

    let { email, password, firstName, lastName } = user;

    if (shouldLogin) {
      let tokenData: LoginUser = {
        email,
        password
      }

      let token = await this.userService.login(tokenData);

      return {
        user: {
          firstName,
          lastName,
          email
        },
        token,
        error: null
      };
    }

    return {
      user: {
        firstName,
        lastName,
        email
      },
      error: 'Could not get token'
    }
  }

  @MessagePattern({ cmd: 'loginRestaurantUser' })
  async login(@Payload() loginUserDto: LoginUser) {
    let user = await this.localStrategy.validate(loginUserDto.email, loginUserDto.password);

    if (user) {
      let token = await this.userService.login(loginUserDto);
      let { email, name } = user;

      return {
        user: {
          name,
          email
        },
        token,
        error: null
      };
    }

    return {
      error: 'Coult not log in.'
    }
  }

  @MessagePattern({ cmd: 'isLoggedIn' })
  async isLoggedIn(data: { jwt: string }) {
    try {
      return this.userService.validateToken(data.jwt);
    } catch (e) {
      console.log('token validation failed', e);
      Logger.log(e);
      return false;
    }
  }
}
