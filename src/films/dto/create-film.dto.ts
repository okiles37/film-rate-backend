import { IsString, IsInt, Min, Max, IsOptional, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateFilmDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  director: string;
@Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1888) // İlk film yılı
  @Max(new Date().getFullYear() + 5) // Gelecek 5 yıl
  releaseYear: number;

  @IsUrl()
  @IsOptional()
  posterUrl?: string;

  @IsInt()
  @IsOptional()
  tur?: number;
  genreId?: number;
}