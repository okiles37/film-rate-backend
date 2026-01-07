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
      // PORTU TEKRAR 5432 YAPTIK AMA SONUNA ÖZEL SSL EKLEDİK
      url: 'postgresql://postgres:1U9Z19G1gR0BmZoT@db.yvyutniyznxnkypawqdb.supabase.co:5432/postgres?sslmode=require',
      autoLoadEntities: true,
      synchronize: true, 
      ssl: {
        rejectUnauthorized: false, // Bu satırı ASLA silme, hayat kurtarır
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