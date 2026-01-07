import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { Film } from './film.entity';
import { Genre } from '../genres/genre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Film, Genre])],
  providers: [FilmsService],
  controllers: [FilmsController],
})
export class FilmsModule {}