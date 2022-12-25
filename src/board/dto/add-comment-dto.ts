import { InputType, PickType } from '@nestjs/graphql';
import { Comment } from '../entities/comment.entity';

@InputType()
export class AddCommentDto extends PickType(
  Comment,
  ['description', 'boardIdx'],
  InputType,
) {}
