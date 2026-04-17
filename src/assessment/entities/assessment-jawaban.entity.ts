/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('assessment_jawaban')
export class AssessmentJawaban {
  @PrimaryGeneratedColumn()
  id_jawaban: number;

  @Column()
  id_pertanyaan: number;

  @Column({ nullable: true })
  id_user: number; // ID Sekolah (dari login)

  @Column({ type: 'text', nullable: true })
  jawaban: string;

  // REVISI DI SINI: Tambahkan nullable: true
  @Column({ type: 'int', default: 0, nullable: true })
  skor: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nama_pengisi: string; // Nama Guru (input manual di form)

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date; // Penanda waktu pengisian
}
