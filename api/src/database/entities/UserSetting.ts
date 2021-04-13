import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm'
import { User } from './User'
import { Space } from './Space'
import { UIData, Preferences } from '../../shared/types/preferences'

@Entity('user_settings')
export class UserSetting {
  @PrimaryGeneratedColumn()
  id: number

  @Column('integer')
  userId: number

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'userId' })
  @Index()
  user!: User

  @Column('integer')
  spaceId: number

  @ManyToOne((type) => Space, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'spaceId' })
  @Index()
  space: Space

  @Column({ type: 'jsonb', default: '{}' })
  data: UIData

  @Column({ type: 'jsonb', default: '{}' })
  preferences: Preferences

  @CreateDateColumn({ type: 'timestamptz'})
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz'})
  updatedAt: Date
}
