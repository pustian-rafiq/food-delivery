import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Response } from 'express';
import { ActivationDto, RegisterDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { AuthGuard } from './guards/auth.guard';
import {
  ActivationResponse,
  LoginResponse,
  RegisterResponse,
} from './types/user.types';
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

  @Mutation(() => LoginResponse)
  async Login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<LoginResponse> {
    return await this.userService.login({ email, password });
  }

  @Query(() => LoginResponse)
  @UseGuards(AuthGuard)
  async getLoggedInUser(@Context() context: { req: Request }) {
    return await this.userService.getLoggedInUser(context.req);
  }

  @Query(() => [User])
  async getUsers() {
    return this.userService.getUsers();
  }
}
