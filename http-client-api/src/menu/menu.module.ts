import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { ClientsModule } from '@nestjs/microservices';
import { RestaurantClientModuleOptions } from 'src/shared/client-modules';

@Module({
  imports: [
    ClientsModule.register([
      RestaurantClientModuleOptions
    ])
  ],
  controllers: [MenuController],
  providers: [MenuService]
})
export class MenuModule { }
