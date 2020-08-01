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
  actorId: number

  @ManyToOne(type => User, actor => actor.actions, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'actorId' })
  @Index()
  actor!: User

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
}