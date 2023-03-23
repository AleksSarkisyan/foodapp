import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super();
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmailAndPassword(email, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (password === user.password) {
      return user;
    }

    return false;
  }
}