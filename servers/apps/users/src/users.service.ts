import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { log } from 'console';
import { Response } from 'express';
import { PrismaService } from '../../../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/user.dto';

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
    const isPhoneNoExist = await this.prisma.user.findUnique({
      where: { phone_number },
    });

    if (isPhoneNoExist) {
      throw new BadRequestException(
        'User already exist with this phone number',
      );
    }

    // Hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const user = {
      name,
      email,
      password: hashedPassword,
      phone_number,
    };

    const activationToken = await this.createActivationToken(user);
    const activationCode = activationToken.activationCode;
    log('activationCode', activationCode);
    return { user, response };
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
