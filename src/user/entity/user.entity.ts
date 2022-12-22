import { Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'int' })
  @Field(() => Int)
  idx: number;

  @Column({ type: 'varchar' })
  @Field(() => String)
  email: string;

  @Column({ type: 'varchar' })
  @Field(() => String)
  password: string;

  @Column({ type: 'varchar' })
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
}
