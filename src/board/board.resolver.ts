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

@Resolver((of) => Board)
export class BoardResolver {
  constructor(private readonly boardService: BoardService) {}

  @Mutation(() => OutputDto)
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
  deleteBoard(
    @AuthUser() authUser: User,
    @Args('input') boardIdx: number,
  ): Promise<OutputDto> {
    return this.boardService.deleteBoard(authUser.idx, boardIdx);
  }

  @Query(() => BoardsOutputDto)
  findBoardByUser(@AuthUser() authUser: User): Promise<BoardsOutputDto> {
    return this.boardService.findBoardByUser(authUser.idx);
  }

  @Mutation(() => OutputDto)
  addComment(
    @AuthUser() authUser: User,
    addCommentDto: AddCommentDto,
  ): Promise<OutputDto> {
    return this.boardService.addComment(authUser, addCommentDto);
  }

  @Mutation(() => OutputDto)
  addReComment(
    @AuthUser() authUser: User,
    addReCommentDto: AddReCommentDto,
  ): Promise<OutputDto> {
    return this.boardService.addReComment(authUser, addReCommentDto);
  }
}
