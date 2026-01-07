import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

 
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); 
  
  console.log(`Uygulama port ${port} üzerinde dış dünyaya açıldı.`);
  });

  // Render'ın dinamik port atamasını (process.env.PORT) önceliğe aldık
  // Eğer port atanmamışsa yerelde 3000'den çalışmaya devam eder
  const port = process.env.PORT || 3000;
  
  await app.listen(port);
  console.log(`Uygulama şu port üzerinden yayında: ${port}`);
}
bootstrap();