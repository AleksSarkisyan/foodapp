import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';
import { RpcException } from '@nestjs/microservices';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super();
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmailAndPassword(email, password);

    if (!user) {
      throw new RpcException('User not found');
    }

    if (password === user.password) {
      return user;
    }

    return false;
  }
}