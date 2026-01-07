import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Review } from '../reviews/review.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  // Çoka-çok ilişki: User ↔ Film (Review aracılığıyla)
 @OneToMany('Review', 'user')
  reviews: any[];
    // Çoka-çok ilişki: User ↔ Film (Watchlist aracılığıyla)
  @OneToMany('Watchlist', 'user')
  watchlists: any[];
}