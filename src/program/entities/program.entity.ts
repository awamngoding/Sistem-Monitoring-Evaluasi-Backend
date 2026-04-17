/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('t_program')
export class Program {
  @PrimaryGeneratedColumn()
  id_program: number;

  @Column({ unique: true, nullable: true })
  kode_program: string;

  @Column()
  nama_program: string;

  @Column({ type: 'text', nullable: true })
  deskripsi: string;

  @Column()
  id_sekolah: number;

  @Column({ nullable: true })
  id_vendor: number;

  @Column({ nullable: true })
  id_pengawas: number; // Kolom baru untuk AO

  @Column()
  kategori: string;

  @Column({ nullable: true })
  tahun: number;

  @Column({ type: 'date', nullable: true })
  tanggal_mulai: Date;

  @Column({ type: 'date', nullable: true })
  tanggal_selesai: Date;

  @Column()
  status_program: string;

  @Column()
  dibuat_oleh: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column({ name: 'file_mou', nullable: true })
  file_mou: string;
}
