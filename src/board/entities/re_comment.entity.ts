import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Comment } from './comment.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class ReComment {
  @PrimaryGeneratedColumn({ type: 'int' })
  @Field(() => Int)
  idx: number;

  @Column({ type: 'varchar' })
  @Field(() => String)
  description: string;

  @CreateDateColumn()
  @Field(() => Date, { nullable: true })
  created_at: Date;

  @UpdateDateColumn()
  @Field(() => Date, { nullable: true })
  updated_at: Date;

  @Field(() => Comment)
  @ManyToOne(() => Comment, (comment) => comment.reComments)
  comment: Comment;

  @RelationId((reComment: ReComment) => reComment.comment)
  commentIdx: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.reComments)
  user: User;
}
