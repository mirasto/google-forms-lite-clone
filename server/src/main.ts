import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  try {
    console.log('Creating Nest application...');
    const app = await NestFactory.create(AppModule);
    console.log('Nest application created.');
    
    app.enableCors({
      origin: ['http://localhost:5173', 'https://studio.apollographql.com'],
      credentials: true,
    });
    
    const PORT = process.env.PORT || 4000;
    console.log(`Starting listen on port ${PORT}...`);
    await app.listen(PORT);
    console.log(`Application is running on: http://localhost:${PORT}/`);
  } catch (error) {
    console.error('Failed to start NestJS application:', error);
  }
}
bootstrap();
