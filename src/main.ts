import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        process.env.FRONTEND_URL || 'https://todolist-arack.vercel.app',
        'https://todolist.vercel.app',
      ].filter(Boolean); // Remover valores undefined
      
      console.log('CORS Origin:', origin);
      console.log('Allowed Origins:', allowedOrigins);
      
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error('CORS blocked origin:', origin);
        callback(new Error(`CORS: Origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Authorization'],
  });

  const port = process.env.PORT ?? 8080; // Koyeb usa 8080 por defecto
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log('CORS enabled for:', process.env.FRONTEND_URL || 'https://todolist-arack.vercel.app');
}
bootstrap();
