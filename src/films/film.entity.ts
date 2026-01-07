import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { Genre } from '../genres/genre.entity';

@Entity()
export class Film {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  director: string;

  @Column('int')
  releaseYear: number;

  @Column({ nullable: true })
  posterUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  // YENİ: Basit tür alanı (1: Komedi, 2: Drama, 3: Aksiyon)
  @Column({ type: 'int', nullable: true })
  tur: number;

  // Bire-çok ilişki: Film → Genre
  @ManyToOne(() => Genre, (genre) => genre.films, { nullable: true })
  genre: Genre;

  @Column({ nullable: true })
  genreId: number;

  // Çoka-çok ilişki: Film ↔ User (Watchlist aracılığıyla)
  @OneToMany('Watchlist', 'film')
  watchlists: any[];
}