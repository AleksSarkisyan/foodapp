import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(@Inject('ORDER_SERVICE') public client: ClientProxy) {

  }
  async getOrders(): Promise<Observable<string>> {
    //console.log('in order service...');

    let message = this.client.send({ cmd: 'getOrders' }, 'test....');
    message.subscribe(el => {
      console.log('el is', el)
    })
    //console.log('got message', message)

    return message;
  }
  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
