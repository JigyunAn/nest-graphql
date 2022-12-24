import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { OutputDto } from 'src/common/output.dto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { EditUserDto } from './dto/edit-user-dto';
import { LoginUserDto, LoginUserOutputDto } from './dto/login-user-dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<OutputDto> {
    try {
      const exists = await this.userRepository.findOne({
        email: createUserDto.email,
      });
      if (exists) {
        return { status: false, error: '이미 가입되어있는 이메일입니다.' };
      }
      await this.userRepository.save(this.userRepository.create(createUserDto));

      return { status: true };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginUserOutputDto> {
    try {
      const userInfo = await this.userRepository.findOne(
        { email: loginUserDto.email },
        { select: ['idx', 'email', 'password'] },
      );

      const passwordCheck = await userInfo.checkPassword(loginUserDto.password);
      if (!passwordCheck || !userInfo) {
        return { status: false, error: '유효하지 않은 유저정보 입니다.' };
      }

      const token = this.authService.getToken(userInfo);

      return { status: true, token };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async editUser(
    userIdx: number,
    editUsetDto: EditUserDto,
  ): Promise<OutputDto> {
    try {
      const userInfo = await this.userRepository.findOne({ idx: userIdx });

      if (editUsetDto.email) {
        userInfo.email = editUsetDto.email;
      }

      if (editUsetDto.password) {
        userInfo.password = editUsetDto.password;
      }
      await this.userRepository.save(userInfo);

      return { status: true };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async deleteUser(userIdx: number): Promise<OutputDto> {
    try {
      await this.userRepository.update(userIdx, {
        use_yn: false,
      });
      return { status: true };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async findById(userIdx: number): Promise<User> {
    try {
      return await this.userRepository.findOne({ idx: userIdx });
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
