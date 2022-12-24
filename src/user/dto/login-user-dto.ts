import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { OutputDto } from 'src/common/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class LoginUserDto extends PickType(
  User,
  ['email', 'password'],
  InputType,
) {}

@ObjectType()
export class LoginUserOutputDto extends OutputDto {
  @Field(() => String, { nullable: true })
  token?: string;
}
