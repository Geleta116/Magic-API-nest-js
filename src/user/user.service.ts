import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel } from './interface/user.interface';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async findAll(): Promise<UserModel[]> {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true
      }
    });
  }
  async findOne(id: number): Promise<UserModel | null> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: id,
        }, select: {
          id: true,
          name: true,
          email: true,
          password: false
        }
      })
      return user;
    } catch (error) { throw error }
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: {
        email: email
      }
    })
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: {
          id: id
        }, data: {
          ...updateUserDto
        }
      })
      return updatedUser;
    } catch (error) { throw error }
  }
  async updatePassword(id: number, password: string): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: id
        }, data: {
          password: password
        }
      })
      return user
    } catch (error) { throw error }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: {
          id: id
        }
      })
    }
    catch (error) {
      throw error
    }
  }
}
