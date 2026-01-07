import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from './genre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Genre])],
  // Not: Genre için şimdilik controller ve service yok
  // Sadece Film service'den erişim için
})
export class GenresModule {}