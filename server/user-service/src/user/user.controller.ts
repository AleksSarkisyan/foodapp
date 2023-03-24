import { Controller, UsePipes, UseFilters, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { ExceptionFilter } from 'src/filters/ExceptionFilter';
import { LocalStrategy } from './strategies/local.strategy';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto';
import { LoginUser, loginUserSchema } from './dto/login-user.dto';
import { JoiValidationPipe } from 'src/shared/pipes/joi-validation-pipe';
import { IsLoggedIn, isLoggedInSchema } from './dto/is-logged-in.dto';
import { GetUserFromToken, getUserFromTokenSchema } from './dto/get-user-from-token.dto';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly localStrategy: LocalStrategy) { }

  @UseFilters(new ExceptionFilter())
  @MessagePattern({ cmd: 'createUser' })
  @UsePipes(new JoiValidationPipe(createUserSchema))
  /** Creates user and issues access token */
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

  @UseFilters(new ExceptionFilter())
  @MessagePattern({ cmd: 'loginUser' })
  @UsePipes(new JoiValidationPipe(loginUserSchema))
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
      error: 'Could not log in.'
    }
  }

  @UseFilters(new ExceptionFilter())
  @MessagePattern({ cmd: 'isLoggedIn' })
  @UsePipes(new JoiValidationPipe(isLoggedInSchema))
  async isLoggedIn(data: IsLoggedIn) {
    try {
      return this.userService.validateToken(data.jwt);
    } catch (e) {
      console.log('token validation failed', e);
      Logger.log(e);
      return false;
    }
  }

  @UseFilters(new ExceptionFilter())
  @MessagePattern({ cmd: 'getUserFromToken' })
  @UsePipes(new JoiValidationPipe(getUserFromTokenSchema))
  async getUserFromToken(data: GetUserFromToken) {
    try {
      return this.userService.getUserFromToken(data.token);
    } catch (e) {
      console.log('token validation failed', e);
      Logger.log(e);
      return false;
    }
  }
}
