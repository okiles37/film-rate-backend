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
      host: 'aws-0-eu-central-1.pooler.supabase.com',
      port: 6543,
      // DİKKAT: Kullanıcı adının sonuna proje ID'ni ekledik
      username: 'postgres.yvyutniyznxnkypawqdb', 
      password: '1U9Z19G1gR0BmZoT',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true, // Tabloları senin için otomatik açacak
      ssl: {
        rejectUnauthorized: false, // Sertifika hatasını susturan ayar
      },
      extra: {
        // Supabase bazen proje ID'sini burada da görmek ister
        options: '-c project=yvyutniyznxnkypawqdb',
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