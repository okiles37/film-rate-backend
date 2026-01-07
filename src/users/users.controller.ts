import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  Put,
  Headers,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 1. KAYIT OL (HERKES)
  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.register(createUserDto);
    return {
      message: 'Kullanıcı başarıyla kaydedildi',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  // 2. GİRİŞ YAP (HERKES)
  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.usersService.login(loginUserDto);
    return {
      message: 'Giriş başarılı',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  // 3. TÜM KULLANICILARI GETİR (SADECE ADMIN)
  @Get()
  async findAll(
    @Headers('x-user-role') userRole: string,
  ) {
    // Admin kontrolü
    if (userRole !== 'admin') {
      throw new ForbiddenException('Sadece adminler kullanıcıları görebilir');
    }
    
    const users = await this.usersService.findAll();
    return users;
  }

  // 4. KULLANICI ROLÜNÜ DEĞİŞTİR (SADECE ADMIN)
  @Put(':id/role')
  async updateRole(
    @Headers('x-user-id') currentUserId: string,
    @Headers('x-user-role') currentUserRole: string,
    @Param('id', ParseIntPipe) id: number,
    @Body('role') role: string,
  ) {
    // Admin kontrolü
    if (currentUserRole !== 'admin') {
      throw new ForbiddenException('Sadece adminler rol değiştirebilir');
    }
    
    // Kendi rolünü değiştirme kontrolü
    if (parseInt(currentUserId) === id) {
      throw new BadRequestException('Kendi rolünüzü değiştiremezsiniz');
    }
    
    const updatedUser = await this.usersService.updateRole(id, role);
    return {
      message: 'Kullanıcı rolü başarıyla güncellendi',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    };
  }

  // 5. KULLANICI SİL (SADECE ADMIN)
  @Delete(':id')
  async remove(
    @Headers('x-user-id') currentUserId: string,
    @Headers('x-user-role') currentUserRole: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    // Admin kontrolü
    if (currentUserRole !== 'admin') {
      throw new ForbiddenException('Sadece adminler kullanıcı silebilir');
    }
    
    // Kendini silme kontrolü
    if (parseInt(currentUserId) === id) {
      throw new BadRequestException('Kendi hesabınızı silemezsiniz');
    }
    
    await this.usersService.remove(id);
    return { message: 'Kullanıcı başarıyla silindi' };
  }
}