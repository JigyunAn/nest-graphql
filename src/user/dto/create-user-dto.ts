import { ArgsType, PickType } from '@nestjs/graphql';
import { User } from '../entity/user.entity';

@ArgsType()
export class CreateUserDto extends PickType(User, [
  'email',
  'password',
  'nickname',
]) {}
