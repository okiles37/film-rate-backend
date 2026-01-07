import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // Yeni review oluştur (kullanıcı giriş yapmış olmalı)
  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Request() req, @Body() createReviewDto: CreateReviewDto) {
    // NOT: Şimdilik userId'yi manuel gönderiyoruz, sonra JWT'den alacağız
    const userId = req.body.userId || 1; // Test için varsayılan: 1
    const review = await this.reviewsService.create(userId, createReviewDto);
    return {
      message: 'Review created successfully',
      review,
    };
  }

  // Tüm review'ları getir (admin için)
  @Get()
  async findAll() {
    const reviews = await this.reviewsService.findAll();
    return reviews;
  }

  // ID'ye göre review getir
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const review = await this.reviewsService.findOne(id);
    if (!review) {
      return { message: 'Review not found' };
    }
    return review;
  }

  // Kullanıcının review'larını getir
  @Get('user/:userId')
  async findByUser(@Param('userId', ParseIntPipe) userId: number) {
    const reviews = await this.reviewsService.findByUser(userId);
    return reviews;
  }

  // Filmin review'larını getir
  @Get('film/:filmId')
  async findByFilm(@Param('filmId', ParseIntPipe) filmId: number) {
    const reviews = await this.reviewsService.findByFilm(filmId);
    return reviews;
  }

  // Review güncelle (sadece kendi review'ını)
  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    const userId = req.body.userId || 1; // Test için
    const review = await this.reviewsService.update(id, userId, updateReviewDto);
    return {
      message: 'Review updated successfully',
      review,
    };
  }

  // Review sil (sadece kendi review'ını)
  @Delete(':id')
  async remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.body.userId || 1; // Test için
    await this.reviewsService.remove(id, userId);
    return { message: 'Review deleted successfully' };
  }
}