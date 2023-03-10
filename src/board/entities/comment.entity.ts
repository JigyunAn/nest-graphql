import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { Board } from './board.entity';
import { ReComment } from './re_comment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Comment {
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

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @RelationId((comment: Comment) => comment.user)
  userIdx: number;

  @Field(() => Board)
  @ManyToOne(() => Board, (board) => board.comments)
  board: Board;

  @RelationId((comment: Comment) => comment.board)
  boardIdx: number;

  @Field(() => [ReComment])
  @OneToMany(() => ReComment, (reComment) => reComment.comment, { eager: true })
  reComments: ReComment[];
}
