import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUser } from './dto/login-user';
import { UserAuthorizedGuard } from 'src/guards/UserAuthorizedGuard';
import { Enums } from '@asarkisyan/nestjs-foodapp-shared';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('/create')
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      return error;
    }
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUser) {
    try {
      return await this.userService.login(loginUserDto);
    } catch (error) {
      return error;
    }
  }

  @UseGuards(UserAuthorizedGuard(Enums.User.Generic.SERVICE_NAME))
  @Get('greet')
  async greet(): Promise<string> {
    return 'Auth works...';
  }
}
