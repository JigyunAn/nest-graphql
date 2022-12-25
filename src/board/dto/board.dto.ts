import { Field, ObjectType } from '@nestjs/graphql';
import { OutputDto } from 'src/common/output.dto';
import { Board } from '../entities/board.entity';

@ObjectType()
export class BoardsOutputDto extends OutputDto {
  @Field(() => [Board], { nullable: true })
  board?: Board[];
}

@ObjectType()
export class BoardOutputDto extends OutputDto {
  @Field(() => Board, { nullable: true })
  board?: Board;
}
