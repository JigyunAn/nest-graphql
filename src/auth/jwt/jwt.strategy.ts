import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { Logger as WinLog } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UserService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly log: WinLog,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload) {
    const user = await this.usersService.findById(payload.idx);
    if (user) {
      return user;
    } else {
      this.log.error('[validate]', {
        inputData: payload,
        error: '유요하지않은 토큰입니다.',
      });
    }
  }
}
