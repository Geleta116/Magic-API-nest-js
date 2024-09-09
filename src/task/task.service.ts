import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma.service';
import { Task } from '@prisma/client';

enum TaskStatus {
  Todo = "todo",
  InProgress = "inprogress",
  Completed = "completed"
}
@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) { }

  async create(creator_id: number, createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const createdTask = await this.prisma.task.create({
        data: {
          ...createTaskDto,
          creator: {
            connect: {
              id: creator_id
            }
          }
        }
      })
      return createdTask;
    } catch (error) { throw error }
  }

  async findAll(): Promise<Task[]> {
    try {
      return await this.prisma.task.findMany({})
    } catch (error) {
      throw error
    }
  }

  async findOne(id: number): Promise<Task | null> {
    try {
      return await this.prisma.task.findFirst({
        where: {
          id: id
        }
      })
    } catch (error) {
      throw error
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    try {
      const updatedTask = await this.prisma.task.update({
        where: {
          id: id
        },
        data: {
          ...updateTaskDto
        }
      })
      return updatedTask
    } catch (error) { throw error }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.task.delete({
        where: {
          id: id
        }
      })
    } catch (error) {
      throw error
    }
  }
}
