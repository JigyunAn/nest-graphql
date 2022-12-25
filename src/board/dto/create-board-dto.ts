import { InputType, PickType } from '@nestjs/graphql';
import { Board } from '../entities/board.entity';

@InputType()
export class CreateBoardDto extends PickType(
  Board,
  ['title', 'description'],
  InputType,
) {}
