import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  }
})
export class OrderGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('orderReceivedByRestaurant')
  create(@MessageBody() payload: any) {
    console.log('order created - ', payload);

    // Broadcast message to all connected clients
    // this.server.emit('onMessage', {
    //   message: 'Received message is' + payload
    // })
  }
}