import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardResolver } from './board.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Comment } from './entities/comment.entity';
import { ReComment } from './entities/re_comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, Comment, ReComment])],
  providers: [BoardService, BoardResolver],
})
export class BoardModule {}
