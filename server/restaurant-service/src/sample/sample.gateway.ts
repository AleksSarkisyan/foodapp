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
export class SampleGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('orderCreated')
  create(@MessageBody() payload: any) {
    console.log('payload: ', payload);

    // Broadcast message to all connected clients
    // this.server.emit('onMessage', {
    //   message: 'Received message is' + payload
    // })
  }
}