import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from './film.entity';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { Genre } from '../genres/genre.entity';

@Injectable()
export class FilmsService {
  constructor(
    @InjectRepository(Film)
    private filmsRepository: Repository<Film>,
    @InjectRepository(Genre)
    private genresRepository: Repository<Genre>,
  ) {}

  // Yeni film oluştur
    async create(createFilmDto: CreateFilmDto): Promise<Film> {
    let genre: Genre | null = null;
    
    if (createFilmDto.genreId) {
      genre = await this.genresRepository.findOne({ where: { id: createFilmDto.genreId } as any });
      if (!genre) {
        throw new NotFoundException('Genre not found');
      }
    }

    const film = new Film();
    film.title = createFilmDto.title;
    film.description = createFilmDto.description || '';
    film.director = createFilmDto.director;
    film.releaseYear = createFilmDto.releaseYear;
    film.posterUrl = createFilmDto.posterUrl || '';
    
    if (genre) {
      film.genre = genre;
      film.genreId = genre.id;
    }

    return this.filmsRepository.save(film);
  }

  // Tüm filmleri getir (genre ilişkisiyle)
  async findAll(): Promise<Film[]> {
    return this.filmsRepository.find({ relations: ['genre'] });
  }

  // ID'ye göre film getir
  async findOne(id: number): Promise<Film | null> {
    return this.filmsRepository.findOne({ where: { id } as any, relations: ['genre'] });
  }

  // Film güncelle
  async update(id: number, updateFilmDto: UpdateFilmDto): Promise<Film> {
    const film = await this.filmsRepository.findOne({ where: { id } as any });
    if (!film) {
      throw new NotFoundException('Film not found');
    }

    let genre: Genre | null = null;
    if (updateFilmDto.genreId) {
      genre = await this.genresRepository.findOne({ where: { id: updateFilmDto.genreId } as any });
      if (!genre) {
        throw new NotFoundException('Genre not found');
      }
    }

    // Film'i güncelle
    if (updateFilmDto.title !== undefined) film.title = updateFilmDto.title;
    if (updateFilmDto.description !== undefined) film.description = updateFilmDto.description;
    if (updateFilmDto.director !== undefined) film.director = updateFilmDto.director;
    if (updateFilmDto.releaseYear !== undefined) film.releaseYear = updateFilmDto.releaseYear;
    if (updateFilmDto.posterUrl !== undefined) film.posterUrl = updateFilmDto.posterUrl;
    
    if (genre) {
      film.genre = genre;
      film.genreId = genre.id;
    }

    return this.filmsRepository.save(film);
  }

  // Film sil
  async remove(id: number): Promise<void> {
    const result = await this.filmsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Film not found');
    }
  }

  // Türe göre filmleri getir
  async findByGenre(genreId: number): Promise<Film[]> {
    return this.filmsRepository.find({ where: { genreId }, relations: ['genre'] });
  }
}