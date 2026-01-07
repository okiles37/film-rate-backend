import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS'u etkinleştir
  app.enableCors({
    origin: 'http://localhost:5173', // Frontend URL
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  });

  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000`);
}
bootstrap();