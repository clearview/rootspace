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

@Entity('docs')
export class Doc {
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

  @ManyToOne((type) => Space)
  @JoinColumn({ name: 'spaceId' })
  @Index()
  space!: Space

  @Column('varchar')
  title: string

  @Column('json')
  content: object

  @Column('integer')
  access: number

  @Column('boolean', { default: false })
  isLocked: boolean

  @Column('integer', { default: 0 })
  revision: number

  @CreateDateColumn()
  created: string

  @UpdateDateColumn()
  updated: string
}
