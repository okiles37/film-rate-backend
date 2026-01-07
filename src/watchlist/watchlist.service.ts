import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Watchlist } from './watchlist.entity';
import { CreateWatchlistDto } from './dto/create-watchlist.dto';
import { UpdateWatchlistDto } from './dto/update-watchlist.dto';
import { User } from '../users/user.entity';
import { Film } from '../films/film.entity';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectRepository(Watchlist)
    private watchlistRepository: Repository<Watchlist>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Film)
    private filmsRepository: Repository<Film>,
  ) {}
async getUserFilmWatchlist(userId: number, filmId: number): Promise<Watchlist | null> {
  return this.watchlistRepository.findOne({
    where: { userId, filmId },
  });
}
  // Watchlist'e film ekle
  async addToWatchlist(userId: number, createWatchlistDto: CreateWatchlistDto): Promise<Watchlist> {
    const user = await this.usersRepository.findOne({ where: { id: userId } as any });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const film = await this.filmsRepository.findOne({ where: { id: createWatchlistDto.filmId } as any });
    if (!film) {
      throw new NotFoundException('Film not found');
    }

    // Aynı film zaten watchlist'te mi?
    const existing = await this.watchlistRepository.findOneBy({
      userId,
      filmId: createWatchlistDto.filmId,
    });

    if (existing) {
      throw new ConflictException('Film already in watchlist');
    }

    const watchlistItem = this.watchlistRepository.create({
      status: createWatchlistDto.status,
      user,
      film,
    });

    return this.watchlistRepository.save(watchlistItem);
  }

  // Kullanıcının watchlist'ini getir
  async getUserWatchlist(userId: number): Promise<Watchlist[]> {
    return this.watchlistRepository.find({
      where: { userId },
      relations: ['film'],
    });
  }

  // Watchlist öğesini güncelle (durum değiştirme)
  async updateWatchlistItem(id: number, userId: number, updateWatchlistDto: UpdateWatchlistDto): Promise<Watchlist> {
    const item = await this.watchlistRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!item) {
      throw new NotFoundException('Watchlist item not found');
    }

    // Bu öğe bu kullanıcıya mı ait?
    if (item.user.id !== userId) {
      throw new NotFoundException('Watchlist item not found');
    }

    if (updateWatchlistDto.status !== undefined) {
      item.status = updateWatchlistDto.status;
    }

    return this.watchlistRepository.save(item);
  }

  // Watchlist'ten film çıkar
  async removeFromWatchlist(id: number, userId: number): Promise<void> {
    const item = await this.watchlistRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!item) {
      throw new NotFoundException('Watchlist item not found');
    }

    // Bu öğe bu kullanıcıya mı ait?
    if (item.user.id !== userId) {
      throw new NotFoundException('Watchlist item not found');
    }

    await this.watchlistRepository.remove(item);
  }

  // Filmin hangi kullanıcıların watchlist'inde olduğunu getir (admin için)
  async getFilmWatchlists(filmId: number): Promise<Watchlist[]> {
    return this.watchlistRepository.find({
      where: { filmId },
      relations: ['user'],
    });
  }
}