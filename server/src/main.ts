import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: [
        'http://localhost:5173', 
        'https://studio.apollographql.com'
      ],
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      })
    );

    const PORT = process.env.PORT || 4000;
    
    await app.listen(PORT);
    
    logger.log(`Application is running on: http://localhost:${PORT}/`);
    logger.log(`GraphQL Playground (if enabled) at: http://localhost:${PORT}/graphql`);
    
  } catch (error: unknown) {
    logger.error('❌ Failed to start NestJS application', error);
    process.exit(1); 
  }
}

bootstrap();