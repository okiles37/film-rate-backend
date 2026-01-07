import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { User } from '../users/user.entity';
import { Film } from '../films/film.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Film)
    private filmsRepository: Repository<Film>,
  ) {}

  // Yeni review oluştur
  async create(userId: number, createReviewDto: CreateReviewDto): Promise<Review> {
    // Kullanıcı ve film var mı kontrol et
        const user = await this.usersRepository.findOne({ where: { id: userId } as any });
    if (!user) {
      throw new NotFoundException('User not found');
    }

        const film = await this.filmsRepository.findOne({ where: { id: createReviewDto.filmId } as any });
    if (!film) {
      throw new NotFoundException('Film not found');
    }

    // Aynı kullanıcı aynı filmi daha önce puanlamış mı?
    const existingReview = await this.reviewsRepository.findOneBy({
      userId,
      filmId: createReviewDto.filmId,
    });

    if (existingReview) {
      throw new ConflictException('You have already reviewed this film');
    }

    // Review oluştur
    const review = this.reviewsRepository.create({
      rating: createReviewDto.rating,
      comment: createReviewDto.comment,
      user,
      film,
    });

    return this.reviewsRepository.save(review);
  }

  // Tüm review'ları getir (admin için)
  async findAll(): Promise<Review[]> {
    return this.reviewsRepository.find({ relations: ['user', 'film'] });
  }

  // ID'ye göre review getir
  async findOne(id: number): Promise<Review | null> {
    return this.reviewsRepository.findOne({
      where: { id },
      relations: ['user', 'film'],
    });
  }

  // Kullanıcının review'larını getir
  async findByUser(userId: number): Promise<Review[]> {
    return this.reviewsRepository.find({
      where: { userId },
      relations: ['film'],
    });
  }

  // Filmin review'larını getir
  async findByFilm(filmId: number): Promise<Review[]> {
    return this.reviewsRepository.find({
      where: { filmId },
      relations: ['user'],
    });
  }

  // Review güncelle (sadece kendi review'ını)
  async update(id: number, userId: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.reviewsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Review bu kullanıcıya mı ait?
    if (review.user.id !== userId) {
      throw new NotFoundException('Review not found');
    }

    // Güncelle
    if (updateReviewDto.rating !== undefined) review.rating = updateReviewDto.rating;
    if (updateReviewDto.comment !== undefined) review.comment = updateReviewDto.comment;
    
    return this.reviewsRepository.save(review);
  }

  // Review sil (sadece kendi review'ını)
  async remove(id: number, userId: number): Promise<void> {
    const review = await this.reviewsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Review bu kullanıcıya mı ait?
    if (review.user.id !== userId) {
      throw new NotFoundException('Review not found');
    }

    await this.reviewsRepository.remove(review);
  }
}