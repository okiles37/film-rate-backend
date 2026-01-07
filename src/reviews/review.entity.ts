import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
// User ve Film'i relative import yerine string referansla kullanacağız
// import { User } from '../users/user.entity';
// import { Film } from '../films/film.entity';
import { User } from '../users/user.entity';
import { Film } from '../films/film.entity';

@Entity()
@Unique(['user', 'film']) // Bir kullanıcı aynı filmi birden fazla kez puanlayamaz
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  rating: number; // 1-5 arası

  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  // Çoka-çok ilişki: User ↔ Film
 @ManyToOne('User', 'reviews', { onDelete: 'CASCADE' })
  user: any;

  @Column()
  userId: number;

 @ManyToOne('Film', 'reviews', { onDelete: 'CASCADE' })
  film: any;

  @Column()
  filmId: number;
}