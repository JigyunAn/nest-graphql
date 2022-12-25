import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { Logger as WinLog } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly log: WinLog,
  ) {}

  getToken(loginUser: User): string {
    try {
      const payload = { email: loginUser.email, idx: loginUser.idx };
      return this.jwtService.sign(payload);
    } catch (err) {
      this.log.error('[getToken]', {
        inputData: loginUser,
        error: err,
      });
    }
  }

  verify(jwtString: string) {
    try {
      const payload = this.jwtService.verify(jwtString);

      return payload;
    } catch (err) {
      this.log.error('[verify]', {
        inputData: jwtString,
        error: err,
      });
    }
  }
}
