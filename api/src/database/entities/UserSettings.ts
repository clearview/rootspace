import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm'
import { User } from './User'

@Entity('user_settings')
export class UserSettings {
  @PrimaryGeneratedColumn()
  id: number

  @Column('integer')
  userId: number

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'userId' })
  @Index()
  user!: User

  @Column('varchar')
  title: string

  @Column('jsonb')
  data: object

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz'})
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz'})
  updatedAt: Date
}
