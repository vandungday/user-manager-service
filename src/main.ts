import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Global Pipes
   */
  const validationPipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  });
  app.useGlobalPipes(validationPipe);

  await app.listen(3001, () => console.log('Server is running on port 3001'));
}
bootstrap();
