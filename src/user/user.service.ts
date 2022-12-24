import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { EditUserDto } from './dto/edit-user-dto';
import { LoginUserDto } from './dto/login-user-dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<boolean> {
    try {
      const exists = await this.userRepository.findOne({
        email: createUserDto.email,
      });
      if (exists) {
        return false;
      }
      await this.userRepository.save(this.userRepository.create(createUserDto));

      return true;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<string> {
    try {
      const userInfo = await this.userRepository.findOne(
        { email: loginUserDto.email },
        { select: ['idx', 'email', 'password'] },
      );
      if (!userInfo) {
      }

      const passwordCheck = await userInfo.checkPassword(loginUserDto.password);
      if (!passwordCheck) {
      }

      return this.authService.getToken(userInfo);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async editUser(userIdx: number, editUsetDto: EditUserDto): Promise<boolean> {
    try {
      const userInfo = await this.userRepository.findOne({ idx: userIdx });

      if (editUsetDto.email) {
        userInfo.email = editUsetDto.email;
      }

      if (editUsetDto.password) {
        userInfo.password = editUsetDto.password;
      }
      await this.userRepository.save(userInfo);

      return true;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async deleteUser(userId: number): Promise<boolean> {
    try {
      await this.userRepository.update(userId, {
        use_yn: false,
      });
      return true;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async findById(userId: number): Promise<User> {
    try {
      return await this.userRepository.findOne({ idx: userId });
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
