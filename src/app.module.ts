import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FilmsModule } from './films/films.module';
import { GenresModule } from './genres/genres.module';
import { ReviewsModule } from './reviews/reviews.module';
import { WatchlistModule } from './watchlist/watchlist.module'; // BU SATIRI EKLE

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
  url: 'postgresql://postgres:SENIN_SIFREN@db.yvyutniyznxnkypawqdb.supabase.co:5432/postgres',
  autoLoadEntities: true,
  synchronize: true, // Tabloları Supabase'de senin için otomatik oluşturacak
  ssl: {
    rejectUnauthorized: false // Render'ın güvenli bağlanması için bu şart
  },
    }),
    UsersModule,
    FilmsModule,
    GenresModule,
    ReviewsModule,
    WatchlistModule, // BU SATIRI EKLE
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}