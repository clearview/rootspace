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
export class Notification {

  @PrimaryGeneratedColumn()
  id: number

  @Column('integer')
  userId: number

  @Column('integer')
  actorId: number

  @Column('integer')
  @Index()
  entityId: number

  @Column('varchar')
  entity: string

  @Column('varchar')
  tableName: string

  @Column('varchar', { nullable: true })
  action: string

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

  @ManyToOne(type => User, actor => actor.actions, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'actorId' })
  @Index()
  actor!: User
}