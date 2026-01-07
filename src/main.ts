import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS ayarını en basit ve açık hale getirdik
  app.enableCors(); 

  // Render için '0.0.0.0' eklemesi hayati önem taşır
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); 
  
  console.log(`Uygulama port ${port} üzerinde dış dünyaya açıldı.`);
}
bootstrap();