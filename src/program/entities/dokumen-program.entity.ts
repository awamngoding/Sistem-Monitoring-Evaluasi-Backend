/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('t_dokumen_program')
export class DokumenProgram {
  @PrimaryGeneratedColumn()
  id_dokumen: number;

  @Column()
  id_program: number;

  @Column({ nullable: true })
  jenis_dokumen: string;

  @Column({ nullable: true })
  nama_file: string;

  @Column({ type: 'text' })
  file_path: string;

  @Column({ nullable: true })
  upload_by: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
