import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUser } from './dto/login-user';
import { UserAuthorizedGuard } from 'src/guards/UserAuthorizedGuard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('/create')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUser) {
    return await this.userService.login(loginUserDto);
  }

  @UseGuards(UserAuthorizedGuard('AUTH_SERVICE'))
  @Get('greet')
  async greet(): Promise<string> {
    return 'Auth works...';
  }
}
