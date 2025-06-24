import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  // Crear una nueva tarea
  create(title: string): Promise<Task> {
    const task = new Task();
    task.title = title;
    task.completed = false;
    return this.taskRepository.save(task);
  }

  // Obtener todas las tareas
  findAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  // Marcar tarea como completada o revertir
  async toggle(id: number): Promise<Task | null> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (task) {
      task.completed = !task.completed;
      return this.taskRepository.save(task);
    }
    return null;
  }

  // Eliminar una tarea
  remove(id: number): Promise<void> {
    return this.taskRepository.delete(id).then(() => {});
  }
}
