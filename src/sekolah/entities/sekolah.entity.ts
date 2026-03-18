/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sekolah')
export class Sekolah {
  @PrimaryGeneratedColumn()
  id_sekolah: number;

  @Column({ nullable: true })
  npsn: string;

  @Column()
  nama_sekolah: string;

  @Column({ nullable: true })
  jenjang: string;

  @Column({ nullable: true })
  alamat: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;
}
