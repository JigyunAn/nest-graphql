import { InputType, PickType } from '@nestjs/graphql';
import { User } from '../entity/user.entity';

@InputType()
export class LoginUserDto extends PickType(
  User,
  ['email', 'password'],
  InputType,
) {}
