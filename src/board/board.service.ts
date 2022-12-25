import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { OutputDto } from 'src/common/output.dto';
import { User } from 'src/user/entities/user.entity';
import { Like, Repository } from 'typeorm';
import { AddCommentDto } from './dto/add-comment-dto';
import { AddReCommentDto } from './dto/add-re-comment.dto';
import { BoardOutputDto, BoardsOutputDto } from './dto/board.dto';
import { CreateBoardDto } from './dto/create-board-dto';
import { Board } from './entities/board.entity';
import { Comment } from './entities/comment.entity';
import { ReComment } from './entities/re_comment.entity';
import { Logger as WinLog } from 'winston';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(ReComment)
    private readonly reCommentRepository: Repository<ReComment>,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly log: WinLog,
  ) {}

  async createBoard(
    user: User,
    createBoardDto: CreateBoardDto,
  ): Promise<OutputDto> {
    try {
      await this.boardRepository.save(
        this.boardRepository.create({
          user,
          title: createBoardDto.title,
          description: createBoardDto.description,
        }),
      );

      return { status: true };
    } catch (err) {
      this.log.error('[createBoard]', {
        inputData: { user, createBoardDto },
        error: err,
      });

      return { status: false, error: err };
    }
  }

  async findAllBoard(): Promise<BoardsOutputDto> {
    try {
      const board = await this.boardRepository.find({
        where: {
          use_yn: true,
        },
      });

      return { status: true, board };
    } catch (err) {
      this.log.error('[findAllBoard]', {
        inputData: '',
        error: err,
      });

      return { status: false, error: err };
    }
  }

  async findBoardById(boardIdx: number): Promise<BoardOutputDto> {
    try {
      const board = await this.boardRepository.findOne({
        where: { idx: boardIdx, use_yn: true },
      });

      return { status: true, board };
    } catch (err) {
      this.log.error('[findBoardById]', {
        inputData: { boardIdx },
        error: err,
      });

      return { status: false, error: err };
    }
  }

  async serchBoard(keyword: string): Promise<BoardsOutputDto> {
    try {
      const board = await this.boardRepository.find({
        where: [
          { title: Like(`%${keyword}%`), use_yn: true },
          { description: Like(`%${keyword}%`), use_yn: true },
        ],
      });
      return { status: true, board };
    } catch (err) {
      this.log.error('[serchBoard]', {
        inputData: { keyword },
        error: err,
      });

      return { status: false, error: err };
    }
  }

  async deleteBoard(userIdx: number, boardIdx: number): Promise<OutputDto> {
    try {
      const boardInfo = await this.boardRepository.findOne({ idx: boardIdx });
      if (boardInfo.userIdx != userIdx) {
        return {
          status: false,
          error: '본인이 작성한 게시글만 삭제 가능합니다.',
        };
      }
      boardInfo.use_yn = false;
      await this.boardRepository.save(boardInfo);

      return { status: true };
    } catch (err) {
      this.log.error('[deleteBoard]', {
        inputData: { userIdx, boardIdx },
        error: err,
      });

      return { status: false, error: err };
    }
  }

  async findBoardByUser(userIdx: number): Promise<BoardsOutputDto> {
    try {
      const board = await this.boardRepository.find({
        where: { userIdx, use_yn: true },
      });

      return { status: true, board };
    } catch (err) {
      this.log.error('[findBoardByUser]', {
        inputData: { userIdx },
        error: err,
      });

      return { status: false, error: err };
    }
  }

  async addComment(
    user: User,
    addCommentDto: AddCommentDto,
  ): Promise<OutputDto> {
    try {
      const board = await this.boardRepository.findOne({
        idx: addCommentDto.boardIdx,
      });
      await this.commentRepository.save(
        this.commentRepository.create({
          user,
          board,
          description: addCommentDto.description,
        }),
      );

      return { status: true };
    } catch (err) {
      this.log.error('[addComment]', {
        inputData: { user, addCommentDto },
        error: err,
      });

      return { status: false, error: err };
    }
  }

  async addReComment(
    user: User,
    addReCommentDto: AddReCommentDto,
  ): Promise<OutputDto> {
    try {
      const comment = await this.commentRepository.findOne({
        idx: addReCommentDto.commentIdx,
      });

      await this.reCommentRepository.save(
        this.reCommentRepository.create({
          user,
          comment,
          description: addReCommentDto.description,
        }),
      );

      return { status: true };
    } catch (err) {
      this.log.error('[addReComment]', {
        inputData: { user, addReCommentDto },
        error: err,
      });

      return { status: false, error: err };
    }
  }
}
