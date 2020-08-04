import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn, Index
} from 'typeorm'
import { User } from './User'
import { Space } from './Space'
import { Notification } from './Notification'

@Entity('activities')
export class Activity {

  @PrimaryGeneratedColumn()
  id: number

  @Column('integer')
  actorId: number

  @ManyToOne((type) => User, { eager: true })
  @JoinColumn({ name: 'actorId'})
  @Index()
  actor!: User

  @Column('integer')
  spaceId: number

  @ManyToOne((type) => Space)
  @JoinColumn({ name: 'spaceId' })
  @Index()
  space!: Space

  @Column('integer')
  @Index()
  entityId: number

  @Column('varchar')
  entity: string

  @Column('varchar')
  tableName: string

  @Column('varchar')
  action: string

  @Column('json', { default: '{}' })
  data: object

  @CreateDateColumn({ type: 'timestamptz'})
  createdAt: Date

  @OneToMany(type => Notification, notification => notification.activity, {eager: false, onDelete: 'CASCADE'})
  public notifications!: Notification[]
}