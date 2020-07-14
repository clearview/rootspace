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

@Entity('follows')
export class Follow {

  @PrimaryGeneratedColumn()
  id: number

  @Column('integer')
  userId: number

  @Column('integer')
  @Index()
  itemId: number

  @Column('varchar')
  tableName: string

  @CreateDateColumn()
  created: string

  @UpdateDateColumn()
  updated: string

  @DeleteDateColumn({ type: 'timestamptz'})
  deletedAt: Date

  @ManyToOne(type => User, user => user.follows, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'userId' })
  @Index()
  user!: User
}