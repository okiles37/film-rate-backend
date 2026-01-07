import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['user', 'film']) // Bir kullanıcı aynı filmi listesine bir kez ekleyebilir
export class Watchlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'to_watch' })
  status: string; // 'to_watch', 'watched', 'favorite'

  @CreateDateColumn()
  addedAt: Date;

  @Column()
  userId: number;

  @Column()
  filmId: number;

  // Çoka-çok ilişki: User ↔ Film
  @ManyToOne('User', 'watchlists', { onDelete: 'CASCADE' })
  user: any;

  @ManyToOne('Film', 'watchlists', { onDelete: 'CASCADE' })
  film: any;
}