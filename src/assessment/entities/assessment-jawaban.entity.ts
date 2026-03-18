/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('assessment_jawaban')
export class AssessmentJawaban {
  @PrimaryGeneratedColumn()
  id_jawaban: number;

  @Column()
  id_pertanyaan: number;

  @Column({ nullable: true })
  id_user: number;

  @Column({ nullable: true })
  jawaban: string;

  @Column({ nullable: true })
  skor: number;

  @Column({ nullable: true })
  nama_pengisi: string;
}
