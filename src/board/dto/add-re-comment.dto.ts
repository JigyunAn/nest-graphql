import { InputType, PickType } from '@nestjs/graphql';
import { ReComment } from '../entities/re_comment.entity';

@InputType()
export class AddReCommentDto extends PickType(
  ReComment,
  ['description', 'commentIdx'],
  InputType,
) {}
