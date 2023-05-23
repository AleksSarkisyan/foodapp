import { Enums } from '@asarkisyan/nestjs-foodapp-shared';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OrderService } from './order.service';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';



@WebSocketGateway({
  cors: {
    origin: '*',
  }
})

@Injectable()
export class OrderGateway {
  constructor(
    @Inject(Enums.Restaurant.Generic.SERVICE_NAME) public client: ClientProxy) { }
  @WebSocketServer()
  server: Server;

  @SubscribeMessage(Enums.Order.Commands.ORDER_RECEIVED_BY_RESTAURANT)
  create(@MessageBody() payload: any) {
    console.log('order created - ', payload);
  }

  @SubscribeMessage('orderConfirmed')
  async orderConfirmed(@MessageBody() payload: string) {
    this.server.emit('orderConfirmed', payload)

    const order = JSON.parse(payload);
    const orderId = order.orderNumber;

    let updateOrderStatus = this.client.send({
      cmd: 'updateOrderStatus'
    },
      {
        orderId,
        status: Enums.Order.OrderStatuses.RESTAURANT_RECEIVED
      });

    await firstValueFrom(updateOrderStatus);
  }
}