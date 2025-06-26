// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { GoogleAuthService } from './google-auth.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private googleAuthService: GoogleAuthService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.validateUser(username, pass);
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async googleLogin(idToken: string) {
    try {
      // Verificar el token de Google
      const googleData = await this.googleAuthService.verifyIdToken(idToken);

      // Buscar o crear usuario
      const user = await this.usersService.findOrCreateGoogleUser(googleData);

      // Generar JWT
      const payload = { username: user.username, sub: user.id, email: user.email };
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          picture: user.picture,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  async register(registerDto: RegisterDto) {
    // Verificar si el usuario ya existe
    const existingUserByUsername = await this.usersService.findByUsername(registerDto.username);
    if (existingUserByUsername) {
      throw new ConflictException('El nombre de usuario ya está en uso');
    }

    const existingUserByEmail = await this.usersService.findByEmail(registerDto.email);
    if (existingUserByEmail) {
      throw new ConflictException('El email ya está registrado');
    }

    // Crear el usuario
    const user = await this.usersService.create(
      registerDto.username,
      registerDto.password,
      registerDto.email,
    );

    // Generar JWT
    const payload = { username: user.username, sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
      },
    };
  }
}
