import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth.decorator';
import { OutputDto } from 'src/common/output.dto';
import { CreateUserDto } from './dto/create-user-dto';
import { EditUserDto } from './dto/edit-user-dto';
import { LoginUserDto, LoginUserOutputDto } from './dto/login-user-dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => OutputDto)
  createUser(@Args('input') createUserDto: CreateUserDto): Promise<OutputDto> {
    return this.userService.createUser(createUserDto);
  }

  @Mutation(() => LoginUserOutputDto)
  login(
    @Args('input') loginUserDto: LoginUserDto,
  ): Promise<LoginUserOutputDto> {
    return this.userService.login(loginUserDto);
  }

  @Mutation(() => OutputDto)
  editUser(
    @AuthUser() authUser: User,
    @Args('input') editUserDto: EditUserDto,
  ): Promise<OutputDto> {
    return this.userService.editUser(authUser.idx, editUserDto);
  }

  @Query(() => OutputDto)
  deleteUser(@AuthUser() authUser: User): Promise<OutputDto> {
    return this.userService.deleteUser(authUser.idx);
  }
}
