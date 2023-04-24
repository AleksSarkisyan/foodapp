import { Module } from '@nestjs/common';
import { MapquestService } from './mapquest.service';
import { MapquestController } from './mapquest.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [MapquestController],
  providers: [MapquestService],
  exports: [MapquestService]
})
export class MapquestModule { }
