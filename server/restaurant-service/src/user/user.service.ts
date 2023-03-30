import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Types } from '@asarkisyan/nestjs-foodapp-shared';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User)
    private userModel: typeof User,
  ) { }

  create(createRestaurantUserDto: Types.RestaurantUser.CreateRestaurantUserDto) {
    return this.userModel.create({ ...createRestaurantUserDto });
  }

  findOne(id: number) {
    return this.userModel.findOne({
      where: {
        id,
      },
    });
  }

  async findByEmailAndPassword(email: string, password: string) {
    return await this.userModel.findOne({
      where: {
        email,
        password
      },
    });
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({
      where: {
        email
      },
    });
  }

  async login(user: Types.User.LoginUser) {
    const payload = { user, sub: user.email };

    return {
      email: user.email,
      accessToken: this.jwtService.sign(payload)
    };
  }

  async getUserFromToken(token: string) {
    let tokenData = this.jwtService.decode(token);
    let userData = tokenData['user'];
    let email = userData.email;

    return this.findByEmail(email);
  }

  validateToken(jwt: string) {
    return this.jwtService.verify(jwt);
  }
}
