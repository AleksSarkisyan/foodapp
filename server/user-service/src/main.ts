import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Enums } from '@asarkisyan/nestjs-foodapp-shared';

const logger = new Logger('USER_SERVICE');

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.REDIS,
    options: {
      name: Enums.User.Generic.SERVICE_NAME,
      host: 'localhost',
      port: 6379,
    },
  });

  await app.listen();
  logger.log('USER SERVICE LISTENING...');
}

bootstrap();
