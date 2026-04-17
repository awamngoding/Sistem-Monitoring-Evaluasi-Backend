/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('t_assessment')
export class Assessment {
  @PrimaryGeneratedColumn()
  id_assessment: number;

  @Column({ nullable: true })
  id_ho: number;

  @Column({ nullable: true })
  nama: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  dibuat_oleh: number;

  @Column({ nullable: true })
  created_at: Date;

  @Column({ nullable: true })
  updated_at: Date;

  @Column({ type: 'boolean', default: true }) // <-- tambah ini
  aktif: boolean;

  @Column({ nullable: true })
  id_sekolah: number;

  @Column({ nullable: true })
  sent_at: Date;

  @Column({ nullable: true })
  tenggat: number;

  @Column({ default: 'non-akademik' })
  jenis: string;
}
