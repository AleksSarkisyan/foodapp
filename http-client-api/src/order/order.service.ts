import { Enums } from '@asarkisyan/nestjs-foodapp-shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderGateway } from './order.gateway';


@Injectable()
export class OrderService {
  constructor(
    @Inject(Enums.Restaurant.Generic.SERVICE_NAME) public client: ClientProxy,
    @Inject(Enums.User.Generic.SERVICE_NAME) public userClient: ClientProxy,
    private orderGateway: OrderGateway
  ) {

  }
  async create(createOrderDto: CreateOrderDto) {
    let userToken = this.userClient.send({ cmd: Enums.User.Commands.GET_USER_FROM_TOKEN }, { token: createOrderDto.token });
    let user = await firstValueFrom(userToken);
    createOrderDto.userId = user.id;

    let message = this.client.send({ cmd: Enums.Order.Commands.CREATE_ORDER }, createOrderDto);

    let orderResult = await firstValueFrom(message)

    this.orderGateway.server.emit(Enums.Restaurant.Websocket.ORDER_CREATED, JSON.stringify(orderResult))

    return orderResult;
  }

}
