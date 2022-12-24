import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserDto } from './dto/create-user-dto';
import { EditUserDto } from './dto/edit-user-dto';
import { LoginUserDto } from './dto/login-user-dto';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => Boolean)
  createUser(@Args('input') createUserDto: CreateUserDto): Promise<boolean> {
    return this.userService.createUser(createUserDto);
  }

  @Mutation(() => String)
  login(@Args('input') loginUserDto: LoginUserDto): Promise<string> {
    return this.userService.login(loginUserDto);
  }

  @Mutation(() => String)
  editUser(
    @AuthUser() authUser: User,
    @Args('input') editUserDto: EditUserDto,
  ): Promise<boolean> {
    return this.userService.editUser(authUser.idx, editUserDto);
  }

  @Query(() => String)
  deleteUser() {
    return 'test';
  }
}
