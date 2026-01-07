import { 
  Injectable, 
  ConflictException, 
  UnauthorizedException, 
  NotFoundException,
  BadRequestException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // KAYIT OLMA
  async register(createUserDto: CreateUserDto): Promise<any> {
    const { email, password, adminKey } = createUserDto;

    // Email kontrolü
    const existingUser = await this.usersRepository.findOne({ 
      where: { email } 
    });
    if (existingUser) {
      throw new ConflictException('Bu email adresi zaten kullanılıyor');
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Admin key kontrolü
    let role = 'user';
    if (adminKey && adminKey.trim() === 'FILMRATE2025') {
      role = 'admin';
    }

    // Kullanıcı oluştur
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      role,
    });

    const savedUser = await this.usersRepository.save(user);
    
    // Şifreyi döndürmeden önce kaldır
    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  // GİRİŞ YAPMA
  async login(loginUserDto: LoginUserDto): Promise<any> {
    const { email, password } = loginUserDto;

    // Kullanıcıyı bul
    const user = await this.usersRepository.findOne({ 
      where: { email } 
    });
    if (!user) {
      throw new UnauthorizedException('Email veya şifre hatalı');
    }

    // Şifreyi kontrol et
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email veya şifre hatalı');
    }

    // Şifreyi döndürmeden önce kaldır
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // TÜM KULLANICILARI GETİR (ŞİFRESİZ)
  async findAll(): Promise<any[]> {
    const users = await this.usersRepository.find({
      select: ['id', 'email', 'role', 'createdAt'],
      order: { createdAt: 'DESC' },
    });
    
    return users;
  }

  // ROL GÜNCELLE
  async updateRole(id: number, role: string): Promise<any> {
    // Geçerli rol kontrolü
    if (!['user', 'admin'].includes(role)) {
      throw new BadRequestException('Geçersiz rol. Sadece "user" veya "admin" olabilir');
    }

    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    user.role = role;
    const updatedUser = await this.usersRepository.save(user);
    
    // Şifreyi döndürmeden önce kaldır
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  // KULLANICI SİL
  async remove(id: number): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    // Admin silme kontrolü (son admin kalmasın)
    if (user.role === 'admin') {
      const adminCount = await this.usersRepository.count({ 
        where: { role: 'admin' } 
      });
      
      if (adminCount <= 1) {
        throw new BadRequestException('Sistemde en az bir admin olmalıdır');
      }
    }

    await this.usersRepository.remove(user);
  }
}