import { Controller, UsePipes, UseFilters, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { ExceptionFilter } from 'src/filters/ExceptionFilter';
import { LocalStrategy } from './local.strategy';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto';
import { LoginUser } from './dto/login-user';
import { JoiValidationPipe } from 'src/shared/pipes/joi-validation-pipe';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly localStrategy: LocalStrategy) { }

  @UseFilters(new ExceptionFilter())
  @MessagePattern({ cmd: 'createUser' })
  @UsePipes(new JoiValidationPipe(createUserSchema))
  /** Creates user and access token */
  async create(@Payload() createUserDto: CreateUserDto) {
    let user = await this.userService.create(createUserDto);
    let shouldLogin = await this.localStrategy.validate(user.email, user.password);
    let { email, password, name } = user;

    if (shouldLogin) {
      let tokenData: LoginUser = {
        email,
        password
      }

      let token = await this.userService.login(tokenData);

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
      user: {
        name,
        email
      },
      error: 'Could not get token'
    }
  }

  @MessagePattern({ cmd: 'loginUser' })
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

  @MessagePattern({ cmd: 'getUserFromToken' })
  async getUserFromToken(token: string) {
    try {
      return this.userService.getUserFromToken(token);
    } catch (e) {
      console.log('token validation failed', e);
      Logger.log(e);
      return false;
    }
  }
}
