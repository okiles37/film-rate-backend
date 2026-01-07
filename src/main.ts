import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS ayarını en esnek hale getirdik
  // Bu sayede Vercel'deki siten backend'e rahatça ulaşabilecek
  app.enableCors({
    origin: true, // Tüm kaynaklara izin ver
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Render'ın dinamik port atamasını (process.env.PORT) önceliğe aldık
  // Eğer port atanmamışsa yerelde 3000'den çalışmaya devam eder
  const port = process.env.PORT || 3000;
  
  await app.listen(port);
  console.log(`Uygulama şu port üzerinden yayında: ${port}`);
}
bootstrap();