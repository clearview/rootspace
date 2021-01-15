import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
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
  @JoinColumn({ name: 'actorId' })
  @Index()
  actor!: User

  @Column('integer')
  spaceId: number

  @ManyToOne((type) => Space, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'spaceId' })
  @Index()
  space!: Space

  @Column('integer')
  @Index()
  entityId: number

  @Column('varchar')
  entity: string

  @Column({ name: 'data', type: 'jsonb', default: '{}' })
  context: object | object[]

  @Column('varchar')
  action: string

  @Column('varchar')
  type: string

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @OneToMany(
    (type) => Notification,
    (notification) => notification.activity,
    { eager: false, onDelete: 'CASCADE' }
  )
  public notifications!: Notification[]
}
