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
import { Space } from './Space'
import { Activity } from './Activity'

@Entity('notifications')
export class Notification {

  @PrimaryGeneratedColumn()
  id: number

  @Column('integer')
  spaceId: number

  @ManyToOne((type) => Space)
  @JoinColumn({ name: 'spaceId' })
  @Index()
  space!: Space

  @Column('integer')
  userId: number

  @ManyToOne(type => User, user => user.notifications, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'userId' })
  @Index()
  user!: User

  @Column('integer')
  activityId: number

  @ManyToOne((type) => Activity, activity => activity.notifications, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'activityId' })
  @Index()
  activity!: Activity

  @Column('boolean', { default: false })
  isRead: boolean

  @CreateDateColumn({ type: 'timestamptz'})
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz'})
  updatedAt: Date

  @DeleteDateColumn({ type: 'timestamptz'})
  public deletedAt: Date
}