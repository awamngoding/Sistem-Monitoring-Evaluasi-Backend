/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { Program } from './entities/program.entity';
import { DokumenProgram } from './entities/dokumen-program.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Program, DokumenProgram])],
  controllers: [ProgramController],
  providers: [ProgramService],
})
export class ProgramModule {}
