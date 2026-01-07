import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  Headers,
  Inject,
} from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { CreateWatchlistDto } from './dto/create-watchlist.dto';
import { UpdateWatchlistDto } from './dto/update-watchlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Watchlist } from './watchlist.entity';

@Controller('watchlist')
export class WatchlistController {
  constructor(
    private readonly watchlistService: WatchlistService,
    @InjectRepository(Watchlist)
    private watchlistRepository: Repository<Watchlist>,
  ) {}

  // Watchlist'e film ekle
  @Post()
  @UsePipes(new ValidationPipe())
  async addToWatchlist(
    @Headers('x-user-id') userIdHeader: string,
    @Body() createWatchlistDto: CreateWatchlistDto,
  ) {
    const userId = userIdHeader ? parseInt(userIdHeader) : 1;
    const item = await this.watchlistService.addToWatchlist(userId, createWatchlistDto);
    return {
      message: 'Film added to watchlist',
      item,
    };
  }

  // Kullanıcının watchlist'ini getir
  @Get('user/:userId')
  async getUserWatchlist(@Param('userId', ParseIntPipe) userId: number) {
    const watchlist = await this.watchlistService.getUserWatchlist(userId);
    return watchlist;
  }

  // Kullanıcının belirli bir film için watchlist durumunu getir
  @Get('user/:userId/film/:filmId')
  async getUserFilmWatchlist(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('filmId', ParseIntPipe) filmId: number,
  ) {
    const watchlist = await this.watchlistRepository.findOne({
      where: { userId, filmId },
    });
    
    if (!watchlist) {
      return { status: null };
    }
    
    return { status: watchlist.status };
  }

  // Watchlist öğesini güncelle (durum değiştirme)
  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updateWatchlistItem(
    @Headers('x-user-id') userIdHeader: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWatchlistDto: UpdateWatchlistDto,
  ) {
    const userId = userIdHeader ? parseInt(userIdHeader) : 1;
    const item = await this.watchlistService.updateWatchlistItem(id, userId, updateWatchlistDto);
    return {
      message: 'Watchlist item updated',
      item,
    };
  }

  // Watchlist'ten film çıkar
  @Delete(':id')
  async removeFromWatchlist(
    @Headers('x-user-id') userIdHeader: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = userIdHeader ? parseInt(userIdHeader) : 1;
    await this.watchlistService.removeFromWatchlist(id, userId);
    return { message: 'Film removed from watchlist' };
  }

  // Filmin hangi kullanıcıların watchlist'inde olduğunu getir (admin için)
  @Get('film/:filmId')
  async getFilmWatchlists(@Param('filmId', ParseIntPipe) filmId: number) {
    const watchlists = await this.watchlistService.getFilmWatchlists(filmId);
    return watchlists;
  }
}