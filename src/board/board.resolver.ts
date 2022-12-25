import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth.decorator';
import { OutputDto } from 'src/common/output.dto';
import { User } from 'src/user/entities/user.entity';
import { BoardService } from './board.service';
import { AddCommentDto } from './dto/add-comment-dto';
import { AddReCommentDto } from './dto/add-re-comment.dto';
import { BoardOutputDto, BoardsOutputDto } from './dto/board.dto';
import { CreateBoardDto } from './dto/create-board-dto';
import { Board } from './entities/board.entity';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver((of) => Board)
export class BoardResolver {
  constructor(private readonly boardService: BoardService) {}

  @Mutation(() => OutputDto)
  @UseGuards(GqlAuthGuard)
  createBoard(
    @AuthUser() authUser: User,
    @Args('input') createBoardDto: CreateBoardDto,
  ): Promise<OutputDto> {
    return this.boardService.createBoard(authUser, createBoardDto);
  }

  @Query(() => BoardsOutputDto)
  findAllBoard(): Promise<BoardsOutputDto> {
    return this.boardService.findAllBoard();
  }

  @Query(() => BoardOutputDto)
  findBoardById(@Args('input') boardIdx: number): Promise<BoardOutputDto> {
    return this.boardService.findBoardById(boardIdx);
  }

  @Query(() => BoardsOutputDto)
  serchBoard(@Args('input') keyword: string): Promise<BoardsOutputDto> {
    return this.boardService.serchBoard(keyword);
  }

  @Mutation(() => OutputDto)
  @UseGuards(GqlAuthGuard)
  deleteBoard(
    @AuthUser() authUser: User,
    @Args('input') boardIdx: number,
  ): Promise<OutputDto> {
    return this.boardService.deleteBoard(authUser.idx, boardIdx);
  }

  @Query(() => BoardsOutputDto)
  @UseGuards(GqlAuthGuard)
  findBoardByUser(@AuthUser() authUser: User): Promise<BoardsOutputDto> {
    return this.boardService.findBoardByUser(authUser.idx);
  }

  @Mutation(() => OutputDto)
  @UseGuards(GqlAuthGuard)
  addComment(
    @AuthUser() authUser: User,
    addCommentDto: AddCommentDto,
  ): Promise<OutputDto> {
    return this.boardService.addComment(authUser, addCommentDto);
  }

  @Mutation(() => OutputDto)
  @UseGuards(GqlAuthGuard)
  addReComment(
    @AuthUser() authUser: User,
    addReCommentDto: AddReCommentDto,
  ): Promise<OutputDto> {
    return this.boardService.addReComment(authUser, addReCommentDto);
  }
}
