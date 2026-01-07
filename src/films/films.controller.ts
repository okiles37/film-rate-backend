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
  Query,
} from '@nestjs/common';
import { FilmsService } from './films.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  // Yeni film oluştur
  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createFilmDto: CreateFilmDto) {
    const film = await this.filmsService.create(createFilmDto);
    return {
      message: 'Film created successfully',
      film,
    };
  }

  // Tüm filmleri getir
  @Get()
  async findAll() {
    const films = await this.filmsService.findAll();
    return films;
  }

  // ID'ye göre film getir
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const film = await this.filmsService.findOne(id);
    if (!film) {
      return { message: 'Film not found' };
    }
    return film;
  }

  // Film güncelle
  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFilmDto: UpdateFilmDto,
  ) {
    const film = await this.filmsService.update(id, updateFilmDto);
    return {
      message: 'Film updated successfully',
      film,
    };
  }

  // Film sil
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.filmsService.remove(id);
    return { message: 'Film deleted successfully' };
  }

  // Türe göre filmleri getir
  @Get('genre/:genreId')
  async findByGenre(@Param('genreId', ParseIntPipe) genreId: number) {
    const films = await this.filmsService.findByGenre(genreId);
    return films;
  }
}