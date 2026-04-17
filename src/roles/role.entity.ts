/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('m_role')
export class Role {
  @PrimaryGeneratedColumn()
  id_role: number;

  @Column({ unique: true })
  nama_role: string;

  @Column({ nullable: true })
  deskripsi: string;
}
