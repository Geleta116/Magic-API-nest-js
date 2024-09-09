import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel } from './interface/user.interface';
import * as bcrypt from 'bcrypt';

const saltOrRounds = parseInt(process.env.SALT || '10');

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async findAll(): Promise<UserModel[]> {
    try {
      return await this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true
        }
      });
    } catch (error) {
      throw new Error('Failed to retrieve users');
    }
  }

  async findOne(id: number): Promise<UserModel | null> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id: id },
        select: {
          id: true,
          name: true,
          email: true,
          password: false
        }
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      throw new Error(`Failed to find user with ID ${id}`);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findFirst({
        where: { email: email }
      });
    } catch (error) {
      throw new Error('Failed to find user by email');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {

      const existingUser = await this.findOne(id);
      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return await this.prisma.user.update({
        where: { id: id },
        data: { ...updateUserDto }
      });
    } catch (error) {
      throw new Error(`Failed to update user with ID ${id}`);
    }
  }

  async updateYourPassword(id: number, password: string): Promise<User> {
    try {

      const existingUser = await this.findOne(id);
      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const hash = await bcrypt.hash(password, saltOrRounds);
      return await this.prisma.user.update({
        where: { id: id },
        data: { password: hash }
      });
    } catch (error) {
      throw new Error(`Failed to update password for user with ID ${id}`);
    }
  }

  async updateUsersPassword(id: number, password: string): Promise<User> {
    try {

      const existingUser = await this.findOne(id);
      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const hash = await bcrypt.hash(password, saltOrRounds);
      return await this.prisma.user.update({
        where: { id: id },
        data: { password: hash }
      });
    } catch (error) {
      throw new Error(`Failed to update password for user with ID ${id}`);
    }
  }

  async remove(id: number): Promise<void> {
    try {

      const existingUser = await this.findOne(id);
      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      await this.prisma.user.delete({
        where: { id: id }
      });
    } catch (error) {
      throw new Error(`Failed to delete user with ID ${id}`);
    }
  }
}
