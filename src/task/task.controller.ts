import { Controller, Get, Post, Param, Body, Delete, UseGuards, Request } from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly usersService: UsersService,
  ) {}

  // Crear una nueva tarea para el usuario autenticado
  @Post()
  async create(@Body('title') title: string, @Request() req) {
    const user = await this.usersService.findByUsername(req.user.username);
    return this.taskService.create(title, user);
  }

  // Obtener todas las tareas del usuario autenticado
  @Get()
  async findMyTasks(@Request() req) {
    const user = await this.usersService.findByUsername(req.user.username);
    return this.taskService.findByUser(user.id);
  }

  // Obtener todas las tareas (solo para administradores o desarrollo)
  @Get('all')
  findAll() {
    return this.taskService.findAll();
  }

  // Marcar tarea como completada
  @Post(':id/toggle')
  complete(@Param('id') id: number) {
    return this.taskService.toggle(id);
  }

  // Eliminar una tarea
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.taskService.remove(id);
  }
}
