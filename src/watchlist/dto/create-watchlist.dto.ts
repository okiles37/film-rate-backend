import { IsInt, IsString, IsIn } from 'class-validator';

export class CreateWatchlistDto {
  @IsInt()
  filmId: number;

  @IsString()
  @IsIn(['to_watch', 'watched', 'favorite']) // Sadece bu 3 değer kabul edilir
  status: string;
}