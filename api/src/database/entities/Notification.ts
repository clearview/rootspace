import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn, ManyToOne, JoinColumn, Unique
} from 'typeorm'
import { User } from './User'

@Entity('notifications')
@Unique('UQ_NOTIFICATIONS', ['userId', 'itemId', 'tableName', 'isRead'])
export class Notification {

  @PrimaryGeneratedColumn()
  id: number

  @Column('integer')
  userId: number

  @Column('integer')
  @Index()
  itemId: number

  @Column('varchar')
  tableName: string

  @Column('varchar', { nullable: true })
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