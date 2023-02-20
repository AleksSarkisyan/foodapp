import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@Inject('USER_SERVICE') public client: ClientProxy) {

  }
  async create(createUserDto: CreateUserDto) {
    console.log('createUserDto== is', createUserDto)
    let message = this.client.send({ cmd: 'createUser' }, createUserDto);
    // message.subscribe(el => {
    //   console.log('el is', el)
    // })
    //console.log('got message', message)

    return message;
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
