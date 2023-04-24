import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MapquestService } from './mapquest.service';


@Controller()
export class MapquestController {
  constructor(private readonly mapquestService: MapquestService) { }
}
