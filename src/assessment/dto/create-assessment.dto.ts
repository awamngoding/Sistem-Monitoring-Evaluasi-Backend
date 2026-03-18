/* eslint-disable prettier/prettier */
import {
  IsNumber,
  IsArray,
  ValidateNested,
  IsString,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class QuestionDto {
  @IsString()
  question: string;

  @IsArray()
  options: string[];
}

export class CreateAssessmentDto {
  @IsNumber()
  id_ho: number;

  @IsString()
  nama: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];

  @IsNumber()
  @IsOptional()
  id_sekolah: number;

  @IsNumber()
  @IsOptional()
  tenggat: number;

  @IsString()
  @IsOptional()
  jenis: string;
}
