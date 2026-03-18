/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// DTO untuk satu pertanyaan
class QuestionDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsArray()
  options: string[];
}

// DTO utama untuk update assessment
export class UpdateAssessmentDto {
  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}