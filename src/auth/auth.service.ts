// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { GoogleAuthService } from './google-auth.service';

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
}
