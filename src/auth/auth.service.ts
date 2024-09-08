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
    try {
      const hash = await bcrypt.hash(data.password, saltOrRounds);
      data.password = hash;
      const user = await this.prisma.user.create({
        data,
      });
      console.log(user)
      const user_roles = await this.getUserRole(user.id)
      const payload = { sub: user.id, email: user.email , roles: user_roles};
      const token = await this.jwtService.signAsync(payload)
      return {
        access_token: token
      };
    } catch (error) {
      throw error
    }
  }

  async signIn(
    loginDto: LoginDto
  ): Promise<{ access_token: string }> {
    try {
      const { email, password } = loginDto
      const user = await this.usersService.findByEmail(email);
      if (!user || !user.password) {
        throw new UnauthorizedException();
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException();
      }
      const user_roles = await this.getUserRole(user.id)
      const payload = { sub: user.id, email: user.email , roles: user_roles};
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
    catch (error) {
      throw error
    }
  }

  async getUserRole(user_id: number): Promise<string[]> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: user_id
        },
        include: {
          roles: {
            include: {
              role: true
            }
          }
        }
      });
      if (user && user.roles) {
        const user_roles = user.roles.map((userRole) => userRole.role.name);
        return user_roles;
      }
      return [];
    } catch (error) {
      throw error;
    }
  }
  
}
