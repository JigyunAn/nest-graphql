import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { Board } from 'src/board/entities/board.entity';
import { Comment } from 'src/board/entities/comment.entity';
import { ReComment } from 'src/board/entities/re_comment.entity';

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'int' })
  @Field(() => Int)
  idx: number;

  @Column({ type: 'varchar', unique: true })
  @Field(() => String)
  email: string;

  @Column({ type: 'varchar' })
  @Field(() => String)
  password: string;

  @Column({ type: 'varchar', unique: true })
  @Field(() => String)
  nickname: string;

  @Column({ default: true, type: 'boolean' })
  @Field(() => Boolean)
  use_yn: boolean;

  @CreateDateColumn()
  @Field(() => Date, { nullable: true })
  created_at: Date;

  @UpdateDateColumn()
  @Field(() => Date, { nullable: true })
  updated_at: Date;

  @Field(() => [Board])
  @OneToMany(() => Board, (board) => board.user)
  boards: Board[];

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @Field(() => [ReComment])
  @OneToMany(() => ReComment, (reComment) => reComment.user)
  reComments: ReComment[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async checkPassword(givenPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(givenPassword, this.password);
      return ok;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
