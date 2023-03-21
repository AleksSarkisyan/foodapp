import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderGateway } from './order.gateway';

@Injectable()
export class OrderService {
  constructor(
    @Inject('RESTAURANT_SERVICE') public client: ClientProxy,
    @Inject('USER_SERVICE') public userClient: ClientProxy,
    private orderGateway: OrderGateway
  ) {

  }
  async getOrders(): Promise<Observable<string>> {
    let message = this.client.send({ cmd: 'getOrders' }, 'test....');
    message.subscribe(el => {
      console.log('el is', el)
    })

    return message;
  }
  async create(createOrderDto: CreateOrderDto) {
    let userToken = this.userClient.send({ cmd: 'getUserFromToken' }, createOrderDto.token);
    let user = await firstValueFrom(userToken);
    createOrderDto.userId = user.id;

    let message = this.client.send({ cmd: 'createOrder' }, createOrderDto);

    let orderResult = await firstValueFrom(message)

    this.orderGateway.server.emit('orderCreated', JSON.stringify(orderResult))

    return orderResult;

  }


}
