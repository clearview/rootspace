import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn, Index
} from 'typeorm'
import { User } from './User'
import { Space } from './Space'

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
  itemId: number

  @Column('varchar')
  entity: string

  @Column('varchar')
  tableName: string

  @Column('varchar')
  action: string

  @CreateDateColumn({ type: 'timestamptz'})
  createdAt: Date
}