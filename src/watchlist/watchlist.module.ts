import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchlistService } from './watchlist.service';
import { WatchlistController } from './watchlist.controller';
import { Watchlist } from './watchlist.entity';
import { User } from '../users/user.entity';
import { Film } from '../films/film.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Watchlist, User, Film])],
  providers: [WatchlistService],
  controllers: [WatchlistController],
})
export class WatchlistModule {}