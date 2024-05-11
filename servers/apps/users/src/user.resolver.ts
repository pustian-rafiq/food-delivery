import { BadRequestException } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Response } from 'express';
import { ActivationDto, RegisterDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { ActivationResponse, RegisterResponse } from './types/user.types';
import { UsersService } from './users.service';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerInput') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ): Promise<RegisterResponse> {
    if (!registerDto.name || !registerDto.email || !registerDto.password) {
      throw new BadRequestException('Please fill all the fields');
    }
    const { activationToken } = await this.userService.register(
      registerDto,
      context.res,
    );
    return { activationToken };
  }

  @Mutation(() => ActivationResponse)
  async activateUser(
    @Args('activationInput') activationDto: ActivationDto,
    @Context()
    context: {
      res: Response;
    },
  ): Promise<ActivationResponse> {
    console.log('object');
    return await this.userService.activateUser(activationDto, context.res);
  }

  @Query(() => [User])
  async getUsers() {
    return this.userService.getUsers();
  }
}
