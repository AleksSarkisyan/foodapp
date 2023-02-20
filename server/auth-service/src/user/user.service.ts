import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { validate } from 'class-validator';
import { UserRepository } from './user.repository';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {

  constructor(
    private readonly userRepository: UserRepository,
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

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
