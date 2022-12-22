import { ArgsType, PickType } from '@nestjs/graphql';
import { User } from '../entity/user.entity';

@ArgsType()
export class loginUserDto extends PickType(User, ['email', 'password']) {}
