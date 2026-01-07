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
      // DİKKAT: Host adresini 'pooler' üzerinden güncelledik
      host: 'aws-0-eu-central-1.pooler.supabase.com',
      port: 6543,
      // Kullanıcı adının sonuna .projeID eklemek Supabase Pooler için ŞART
      username: 'postgres.yvyutniyznxnkypawqdb', 
      password: '1U9Z19G1gR0BmZoT',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false, // Sertifika hatasını susturur
      },
      extra: {
        // Bu ayar Supabase'e "ben geldim, projem de bu" demenin en garanti yolu
        options: '-c project=yvyutniyznxnkypawqdb'
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