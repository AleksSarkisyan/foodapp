import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUser } from './dto/login-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { ErrorMessages } from '@asarkisyan/nestjs-foodapp-shared';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private readonly jwtService: JwtService,
  ) { }
  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    const exists = await this.userModel.findOne({ where: { email } });

    if (exists && exists.id) {
      throw new RpcException(ErrorMessages.USER_EXIST_ERROR);
    }

    let user = await this.userModel.create({ name, email, password });

    return user;
  }

  async login(user: LoginUser) {
    const payload = { user, sub: user.email };

    if (!this.jwtService.sign(payload)) {
      throw new RpcException(ErrorMessages.TOKEN_VALIDATION_ERROR);
    }

    return {
      email: user.email,
      accessToken: this.jwtService.sign(payload)
    };
  }

  validateToken(jwt: string) {
    return this.jwtService.verify(jwt);
  }

  async findOne(id: number) {
    return await this.userModel.findOne({ where: { id } });
  }

  async findByEmailAndPassword(email: string, password: string) {
    return await this.userModel.findOne({ where: { email, password } });
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({
      where: {
        email
      }
    });
  }

  async getUserFromToken(token: string) {
    let tokenData = this.jwtService.decode(token);
    let userData = tokenData['user'];
    let email = userData.email;

    return this.findByEmail(email);
  }
}
