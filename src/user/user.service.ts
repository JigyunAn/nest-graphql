import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { EditUserDto } from './dto/edit-user-dto';
import { loginUserDto } from './dto/login-user-dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
    } catch (err) {}
    return false;
  }

  async login(loginUserDto: loginUserDto): Promise<boolean> {
    try {
      const userInfo = await this.userRepository.findOne({
        email: loginUserDto.email,
      });
      if (!userInfo) {
        return false;
      }

      const passwordCheck = await userInfo.checkPassword(loginUserDto.password);
      if (!passwordCheck) {
        return false;
      }

      return true;
    } catch (err) {
      return false;
    }
  }

  async editUser(userId: number, editUsetDto: EditUserDto): Promise<boolean> {
    try {
      // authGuard 구현후 id 받아와서 나머지 구현
      const userInfo = await this.userRepository.update(userId, {
        ...editUsetDto,
      });

      return true;
    } catch (err) {
      return false;
    }
  }

  async deleteUser(userId: number): Promise<boolean> {
    try {
      await this.userRepository.update(userId, {
        use_yn: false,
      });
      return true;
    } catch (err) {}
    return true;
  }
}
