import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { validate } from 'class-validator';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUser } from './dto/login-user';

@Injectable()
export class UserService {

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {

  }
  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    const exists = await this.userRepository.findOne({ email });

    if (exists && exists.id) {
      throw new RpcException('User exists');
    }

    const user = new User(name, email, password);
    const errors = await validate(user);

    if (errors.length > 0) {
      throw new RpcException('Data validation failed');
    }

    await this.userRepository.persistAndFlush(user);

    return user;
  }

  async login(user: LoginUser) {
    const payload = { user, sub: user.email };

    return {
      email: user.email,
      accessToken: this.jwtService.sign(payload)
    };
  }

  validateToken(jwt: string) {
    return this.jwtService.verify(jwt);
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({ id });
  }

  async findByEmailAndPassword(email: string, password: string) {
    return await this.userRepository.findOne({ email, password });
  }
}
