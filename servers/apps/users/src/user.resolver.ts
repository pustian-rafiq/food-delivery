import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RegisterDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { RegisterResponse } from './types/user.types';
import { UsersService } from './users.service';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerInput') registerDto: RegisterDto,
  ): Promise<RegisterResponse> {
    if (!registerDto.name || !registerDto.email || !registerDto.password) {
      throw new BadRequestException('Please fill all the fields');
    }
    const user = await this.userService.register(registerDto);
    return { user };
  }

  @Query(() => [User])
  async getUsers() {
    return this.userService.getUsers();
  }
}
