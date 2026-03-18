/* eslint-disable prettier/prettier */
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // ✨ Tambahkan ini supaya DTO otomatis divalidasi
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // hanya terima properti yang ada di DTO
      forbidNonWhitelisted: true, // lempar error jika ada properti tambahan
      transform: true, // otomatis convert tipe data (misal string ke number)
    }),
  );

  await app.listen(3000);
}
bootstrap();
