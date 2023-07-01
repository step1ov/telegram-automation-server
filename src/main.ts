import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import { ValidationPipe } from '@nestjs/common';

dayjs.extend(utc);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // Затирает все что не определено в DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(parseInt(process.env.PORT) || 3000);
}
bootstrap();
