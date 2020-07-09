import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn, ManyToOne, JoinColumn
} from 'typeorm'
import { User } from './User'

@Entity('notifications')
export class Notification {

  @PrimaryGeneratedColumn()
  id: number

  @Column('integer')
  userId: number

  @Column('integer')
  @Index()
  itemId: number

  @Column('varchar')
  itemTable: string

  @Column('varchar')
  message: string

  @Column('boolean', { default: false })
  isRead: boolean

  @CreateDateColumn()
  created: string

  @UpdateDateColumn()
  updated: string

  @DeleteDateColumn({ type: 'timestamptz'})
  deletedAt: Date

  @ManyToOne(type => User, user => user.notifications, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'userId' })
  @Index()
  user!: User
}