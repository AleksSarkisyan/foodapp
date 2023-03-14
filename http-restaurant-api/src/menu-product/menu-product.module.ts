import { Module } from '@nestjs/common';
import { MenuProductService } from './menu-product.service';
import { MenuProductController } from './menu-product.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RESTAURANT_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        }
      }
    ])
  ],
  controllers: [MenuProductController],
  providers: [MenuProductService],
  exports: [MenuProductService]
})
export class MenuProductModule { }
