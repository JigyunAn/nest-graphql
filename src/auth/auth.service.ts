import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  getToken(loginUser: User): string {
    try {
      const payload = { email: loginUser.email, idx: loginUser.idx };
      return this.jwtService.sign(payload);
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  verify(jwtString: string) {
    try {
      const payload = this.jwtService.verify(jwtString);

      return payload;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
