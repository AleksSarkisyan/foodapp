import { Controller, Logger, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { JoiValidationPipe } from 'src/shared/pipes/joi-validation-pipe';
import { LocalStrategy } from './local.strategy';
import { Types, Enums } from '@asarkisyan/nestjs-foodapp-shared';

const { CREATE_RESTAURANT_USER, LOGIN_RESTAURANT_USER, IS_LOGGED_IN } = Enums.RestaurantUser.Commands
@Controller()
export class UserController {
  constructor(private readonly userService: UserService, private readonly localStrategy: LocalStrategy) { }

  @MessagePattern({ cmd: CREATE_RESTAURANT_USER })
  @UsePipes(new JoiValidationPipe(Types.RestaurantUser.createRestaurantUserSchema))
  async create(@Payload() createRestaurantUserDto: Types.RestaurantUser.CreateRestaurantUserDto) {
    let user = await this.userService.create(createRestaurantUserDto);
    let shouldLogin = await this.localStrategy.validate(user.email, user.password);

    let { email, password, firstName, lastName } = user;

    if (shouldLogin) {
      let tokenData: Types.User.LoginUser = {
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

  @MessagePattern({ cmd: LOGIN_RESTAURANT_USER })
  async login(@Payload() loginUserDto: Types.User.LoginUser) {
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

  @MessagePattern({ cmd: IS_LOGGED_IN })
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
