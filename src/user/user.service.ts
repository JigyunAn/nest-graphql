import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AuthService } from 'src/auth/auth.service';
import { OutputDto } from 'src/common/output.dto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { EditUserDto } from './dto/edit-user-dto';
import { LoginUserDto, LoginUserOutputDto } from './dto/login-user-dto';
import { User } from './entities/user.entity';
import { Logger as WinLog } from 'winston';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly log: WinLog,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<OutputDto> {
    try {
      const exists = await this.userRepository.findOne({
        email: createUserDto.email,
      });
      if (exists) {
        this.log.error('[createUser]', {
          inputData: createUserDto,
          error: '이미 가입되어있는 로그인입니다.',
        });
        return { status: false, error: '이미 가입되어있는 이메일입니다.' };
      }
      await this.userRepository.save(this.userRepository.create(createUserDto));

      return { status: true };
    } catch (err) {
      this.log.error('[createUser]', {
        inputData: createUserDto,
        error: err,
      });

      return { status: false, error: err };
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginUserOutputDto> {
    try {
      const userInfo = await this.userRepository.findOne(
        { email: loginUserDto.email, use_yn: true },
        { select: ['idx', 'email', 'password'] },
      );

      const passwordCheck = await userInfo.checkPassword(loginUserDto.password);
      if (!passwordCheck || !userInfo) {
        this.log.error('[login]', {
          inputData: loginUserDto,
          error: '유효하지 않은 유저정보 입니다.',
        });
        return { status: false, error: '유효하지 않은 유저정보 입니다.' };
      }

      const token = this.authService.getToken(userInfo);

      return { status: true, token };
    } catch (err) {
      this.log.error('[login]', {
        inputData: loginUserDto,
        error: err,
      });

      return { status: false, error: err };
    }
  }

  async editUser(
    userIdx: number,
    editUsetDto: EditUserDto,
  ): Promise<OutputDto> {
    try {
      const userInfo = await this.userRepository.findOne({
        idx: userIdx,
        use_yn: true,
      });

      if (editUsetDto.email) {
        userInfo.email = editUsetDto.email;
      }

      if (editUsetDto.password) {
        userInfo.password = editUsetDto.password;
      }
      await this.userRepository.save(userInfo);

      return { status: true };
    } catch (err) {
      this.log.error('[editUser]', {
        inputData: { editUsetDto, userIdx },
        error: err,
      });

      return { status: false, error: err };
    }
  }

  async deleteUser(userIdx: number): Promise<OutputDto> {
    try {
      await this.userRepository.update(userIdx, {
        use_yn: false,
      });
      return { status: true };
    } catch (err) {
      this.log.error('[deleteUser]', {
        inputData: { userIdx },
        error: err,
      });

      return { status: false, error: err };
    }
  }

  async findById(userIdx: number): Promise<User> {
    try {
      return await this.userRepository.findOne({ idx: userIdx });
    } catch (err) {
      this.log.error('[findById]', {
        inputData: { userIdx },
        error: err,
      });
    }
  }
}
