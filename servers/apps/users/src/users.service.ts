import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { PrismaService } from '../../../prisma/prisma.service';
import { ActivationDto, LoginDto, RegisterDto } from './dto/user.dto';
import { EmailService } from './email/email.service';

interface UserData {
  name: string;
  email: string;
  password: string;
  phone_number: string;
}
@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  //Register user service
  async register(registerDto: RegisterDto, response: Response) {
    const { name, email, password, phone_number } = registerDto;
    //Check email
    const isEmailExist = await this.prisma.user.findUnique({
      where: { email },
    });

    if (isEmailExist) {
      throw new BadRequestException(
        'User already exist with this email address',
      );
    }

    //Check phone number
    // const isPhoneNoExist = await this.prisma.user.findUnique({
    //   where: { phone_number },
    // });

    // if (isPhoneNoExist) {
    //   throw new BadRequestException(
    //     'User already exist with this phone number',
    //   );
    // }

    // Hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(hashedPassword);
    const user = {
      name,
      email,
      password: hashedPassword,
      phone_number,
    };

    const token = await this.createActivationToken(user);
    const activationCode = token.activationCode;
    const activationToken = token.token;
    // log('activationCode', activationCode);

    //Send email to user
    await this.emailService.sendMailToUser({
      email,
      subject: 'Activate your account',
      template: './activation-mail',
      name,
      activationCode,
    });
    return { activationToken, response };
  }

  //create activation token
  async createActivationToken(user: UserData) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = this.jwtService.sign(
      {
        user,
        activationCode,
      },
      {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
        expiresIn: '5m',
      },
    );
    return { token, activationCode };
  }

  //Activate user
  async activateUser(activationDto: ActivationDto, response: Response) {
    const { activationCode, activationToken } = activationDto;

    const newUser: { user: UserData; activationCode: string } =
      this.jwtService.verify(activationToken, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      } as JwtVerifyOptions) as { user: UserData; activationCode: string };

    if (newUser.activationCode !== activationCode) {
      throw new BadRequestException('Invalid activation code');
    }

    const { name, email, password, phone_number } = newUser.user;

    const existUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existUser) {
      throw new BadRequestException('User already exists with the same email');
    }
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password,
        phone_number,
      },
    });

    return { user, response };
  }
  //login user service
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = {
      email,
      password,
    };

    return user;
  }
  //Get all user service
  async getUsers() {
    return this.prisma.user.findMany({});
  }
}
