import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Enums } from '@asarkisyan/nestjs-foodapp-shared';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: Enums.Restaurant.Generic.SERVICE_NAME,
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        }
      }
    ])
  ],
  controllers: [MenuController],
  providers: [MenuService]
})
export class MenuModule { }
