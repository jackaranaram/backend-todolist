import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  HttpException, 
  HttpStatus,
  UseGuards,
  Request
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface CreateUserDto {
  username: string;
  password: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const { username, password } = createUserDto;
      
      // Verificar si el usuario ya existe
      const existingUser = await this.usersService.findByUsername(username);
      if (existingUser) {
        throw new HttpException('Username already exists', HttpStatus.CONFLICT);
      }

      // Crear el nuevo usuario
      const user = await this.usersService.create(username, password);
      
      // Retornar usuario sin la contraseña
      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error creating user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    const user = await this.usersService.findByUsername(req.user.username);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    
    const { password, ...result } = user;
    return result;
  }

  @Get(':username')
  @UseGuards(JwtAuthGuard)
  async findUser(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    
    const { password, ...result } = user;
    return result;
  }
}
