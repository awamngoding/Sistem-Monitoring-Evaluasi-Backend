import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Assessment } from './entities/assessment.entity';
import { AssessmentPertanyaan } from './entities/assessment-pertanyaan.entity';
import { AssessmentJawaban } from './entities/assessment-jawaban.entity';

import { AssessmentService } from './assessment.service';
import { AssessmentController } from './assessment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Assessment,
      AssessmentPertanyaan,
      AssessmentJawaban,
    ]),
  ],
  controllers: [AssessmentController],
  providers: [AssessmentService],
})
export class AssessmentModule {}
