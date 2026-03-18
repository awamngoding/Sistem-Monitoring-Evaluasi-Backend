/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from '../roles/role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id_user: number;

  @Column()
  nama: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'id_role' })
  role: Role;

  @Column({ nullable: true })
  id_sekolah: number;

  @Column({ nullable: true })
  jenis: string;
}
