import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';


const saltOrRounds = 10;

@Injectable()
export class AuthService {

  constructor(private prisma: PrismaService, private jwtService: JwtService, private usersService: UserService) { }
  async signUp(data: Prisma.UserCreateInput): Promise<{ access_token: string }> {
    const hash = await bcrypt.hash(data.password, saltOrRounds);
    data.password = hash;
    const user = await this.prisma.user.create({
      data,
    });
    console.log(user)
    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload)
    return {
      access_token: token
    };
  }

  async signIn(
    loginDto: LoginDto
  ): Promise<{ access_token: string }> {
    const { email, password } = loginDto
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
