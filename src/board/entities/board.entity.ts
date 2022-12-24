import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { Comment } from './comment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Board {
  @PrimaryGeneratedColumn({ type: 'int' })
  @Field(() => Int)
  idx: number;

  @Column({ type: 'varchar' })
  @Field(() => String)
  title: string;

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
  @ManyToOne(() => User, (user) => user.boards)
  user: User;

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.board)
  comments: Comment[];
}
