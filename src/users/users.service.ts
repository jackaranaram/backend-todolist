// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async create(username: string, password: string, email: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async findById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findWithTasks(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({ 
      where: { id },
      relations: ['tasks']
    });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByGoogleId(googleId: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { googleId } });
  }

  async createFromGoogle(googleData: {
    googleId: string;
    email: string;
    name: string;
    picture: string;
    emailVerified: boolean;
  }): Promise<User> {
    const user = this.usersRepository.create({
      username: googleData.email, // Usar email como username por defecto
      email: googleData.email,
      googleId: googleData.googleId,
      name: googleData.name,
      picture: googleData.picture,
      emailVerified: googleData.emailVerified,
      password: null, // No necesita password para usuarios de Google
    });
    return this.usersRepository.save(user);
  }

  async findOrCreateGoogleUser(googleData: {
    googleId: string;
    email: string;
    name: string;
    picture: string;
    emailVerified: boolean;
  }): Promise<User> {
    // Primero buscar por Google ID
    let user = await this.findByGoogleId(googleData.googleId);
    
    if (user) {
      // Actualizar información si es necesario
      user.name = googleData.name;
      user.picture = googleData.picture;
      user.emailVerified = googleData.emailVerified;
      return this.usersRepository.save(user);
    }
    
    // Si no existe, buscar por email
    user = await this.findByEmail(googleData.email);
    
    if (user) {
      // Vincular cuenta existente con Google
      user.googleId = googleData.googleId;
      user.name = googleData.name;
      user.picture = googleData.picture;
      user.emailVerified = googleData.emailVerified;
      return this.usersRepository.save(user);
    }
    
    // Crear nuevo usuario
    return this.createFromGoogle(googleData);
  }
}
