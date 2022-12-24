import { InputType, PickType } from '@nestjs/graphql';
import { User } from '../entity/user.entity';

@InputType()
export class CreateUserDto extends PickType(
  User,
  ['email', 'password', 'nickname'],
  InputType,
) {}
