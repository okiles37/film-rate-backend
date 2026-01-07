import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FilmsModule } from './films/films.module';
import { GenresModule } from './genres/genres.module';
import { ReviewsModule } from './reviews/reviews.module';
import { WatchlistModule } from './watchlist/watchlist.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      // KULLANICI ADI KISMINA PROJE ID'SİNİ EKLEDİK: postgres.yvyutniyznxnkypawqdb
      url: 'postgresql://postgres.yvyutniyznxnkypawqdb:1U9Z19G1gR0BmZoT@aws-0-eu-central-1.pooler.supabase.com:6543/postgres',
      autoLoadEntities: true,
      synchronize: true, // Tabloları Supabase'de senin için otomatik oluşturur
      ssl: {
        rejectUnauthorized: false, // Sertifika hatasını (self-signed) çözen kritik ayar
      },
      // Bağlantı havuzu ayarları (Bağlantı sıfırlanma hatasını önlemek için)
      extra: {
        max: 10,
        idleTimeoutMillis: 30000,
      }
    }),
    UsersModule,
    FilmsModule,
    GenresModule,
    ReviewsModule,
    WatchlistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}