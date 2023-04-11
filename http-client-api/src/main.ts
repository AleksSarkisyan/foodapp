import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
declare const module: any;

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  //app.enableCors();
  app.setGlobalPrefix('api/v1');
  await app.listen(3001);
  console.log('http-client-api listening on port 3001')
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

}
bootstrap();
