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
      // Supabase Pooler adresin (IPv4 desteği için 6543 şart)
      url: 'postgresql://postgres:1U9Z19G1gR0BmZoT@aws-0-eu-central-1.pooler.supabase.com:6543/postgres',
      autoLoadEntities: true,
      synchronize: true, // Tabloları otomatik oluşturur
      ssl: {
        // İŞTE ÇÖZÜM BURASI: Sertifika hatasını bu satır susturur
        rejectUnauthorized: false, 
      },
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