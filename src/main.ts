import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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

  const configService = app.get(ConfigService);
  const port = configService.get('port');

  app.enableCors();

  await app.listen(port, () => console.log(`Server is running on port ${port}`));
}
bootstrap();
