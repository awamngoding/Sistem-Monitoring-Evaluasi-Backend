/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('t_assessment_pertanyaan')
export class AssessmentPertanyaan {
  @PrimaryGeneratedColumn()
  id_pertanyaan: number;

  @Column()
  id_assessment: number;

  @Column()
  pertanyaan: string;

  @Column({ type: 'jsonb', nullable: true })
  options: string[];

  @Column()
  urutan: number;
}
