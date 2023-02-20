import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.REDIS,
    options: {
      name: 'AUTH_MICROSERVICE',
      host: 'localhost',
      port: 6379,
    },
  });

  await app.listen();
  logger.log('AUTH SERVICE LISTENING...');
}

bootstrap();
