import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Film } from '../films/film.entity';

@Entity()
export class Genre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  // Bire-çok ilişki: Bir türde birden fazla film olabilir
  @OneToMany(() => Film, (film) => film.genre)
  films: Film[];
}