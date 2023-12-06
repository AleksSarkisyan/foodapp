import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserAuthorizedGuard } from 'src/guards/UserAuthorizedGuard';
import { Enums, Types } from '@asarkisyan/nestjs-foodapp-shared';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('/create')
  async create(@Body() createUserDto: Types.User.CreateUserDto) {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      return error;
    }
  }

  @Post('/login')
  async login(@Body() loginUserDto: Types.User.LoginUser) {
    try {
      return await this.userService.login(loginUserDto);
    } catch (error) {
      console.log('error is', error)
      return error;
    }
  }

  @Post('/refresh')
  async refresh(@Body() refreshTokenDto: { refreshToken: string, email: string}) {
    try {
      return await this.userService.refreshToken(refreshTokenDto);
    } catch (error) {
      console.log('error is', error)
      return error;
    }
  }
  
}
