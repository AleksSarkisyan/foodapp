import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';
import { RpcException } from '@nestjs/microservices';
import { Enums } from '@asarkisyan/nestjs-foodapp-shared';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super();
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmailAndPassword(email, password);

    if (!user) {
      throw new RpcException(Enums.User.Messages.USER_NOT_FOUND);
    }

    if (password === user.password) {
      return user;
    }

    return false;
  }
}