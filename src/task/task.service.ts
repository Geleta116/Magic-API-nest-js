import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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
      console.log("dto", createTaskDto)
      console.log(creator_id)
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

  async findAll(creator_id: number): Promise<Task[]> {
    try {
      return await this.prisma.task.findMany({
        where: {
          creator_id: creator_id
        }
      })
    } catch (error) {
      throw error
    }
  }

  async findOne(id: number): Promise<Task | null> {
    try {
      const task = await this.prisma.task.findFirst({
        where: {
          id: id
        }
      })

      if (!task) {
        throw new NotFoundException("task doesn't exist")
      }
      return task
    } catch (error) {
      throw error
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    try {
      const taskToBeUpdated = await this.prisma.task.findFirst({
        where: {
          id: id
        }
      });

      if (!taskToBeUpdated) {
        throw new NotFoundException("Task doesn't exist")
      }
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

  async remove(id: number, roles: string[], user_id: number): Promise<void> {
    try {
      const task = await this.prisma.task.findUnique({
        where: { id: id }
      });

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      if (roles.includes('admin')) {
        await this.prisma.task.delete({
          where: { id: id }
        });
        return;
      }
      if (task.creator_id !== user_id) {
        throw new ForbiddenException('You are not allowed to delete this task');
      }
      await this.prisma.task.delete({
        where: { id: id }
      });
    } catch (error) {
      throw error;
    }
  }
}
