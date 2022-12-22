import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';

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

  @Column({ default: false, type: 'boolean' })
  @Field(() => Boolean)
  use_yn: boolean;

  @Column({ type: 'date' })
  @Field(() => Date)
  created_at: Date;

  @Column({ nullable: true, type: 'date' })
  @Field(() => Date, { nullable: true })
  updated_at: Date;

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
