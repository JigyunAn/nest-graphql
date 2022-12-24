import {
  ExecutionContext,
  Injectable,
  CanActivate,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    try {
      const gqlContext = GqlExecutionContext.create(context).getContext();
      const payload = this.authService.verify(gqlContext.token);
      const userInfo = await this.userService.findById(payload['idx']);

      gqlContext['user'] = userInfo;
      return true;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
