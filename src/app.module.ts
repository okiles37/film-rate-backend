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
      // SENİN NEON LİNKİNİ BURAYA YERLEŞTİRDİM
      url: 'postgresql://neondb_owner:npg_1vdL8ZQTlcfi@ep-orange-unit-agu5hhm1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require',
      autoLoadEntities: true,
      synchronize: true, // Tabloları Neon'da senin için otomatik oluşturacak
      ssl: {
        rejectUnauthorized: false, // Render ve Neon arasındaki bağlantı için bu şart
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