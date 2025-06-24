import { Controller, Get, Post, Param, Body, Delete } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // Crear una nueva tarea
  @Post()
  create(@Body('title') title: string) {
    return this.taskService.create(title);
  }

  // Obtener todas las tareas
  @Get()
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
