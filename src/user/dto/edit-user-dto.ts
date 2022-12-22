import { PartialType } from '@nestjs/graphql';
import { CreateUserDto } from './create-user-dto';

export class EditUserDto extends PartialType(CreateUserDto) {}
