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
      console.log(id)
      const user = await this.prisma.user.findFirst({
        where: { id: id },
        select: {
          id: true,
          name: true,
          email: true,
          password: false
        }
      });

      console.log(user)

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      throw error;
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
      throw error;
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
      throw error;
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
      throw error;
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
      throw error;
    }
  }

  async promoteToAdmin(id: number): Promise<void> {

    try {

      const existingUser = await this.findOne(id);
      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const adminRole = await this.prisma.role.findUnique({
        where: { name: 'admin' },
      });

      if (!adminRole) {
        throw new NotFoundException(`Admin role not found`);
      }
      await this.prisma.userRole.create({
        data: {
          user_id: id,
          role_id: adminRole.id,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
