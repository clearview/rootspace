import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { User } from './User'
import { Space } from './Space'
import { IDocContent } from '../../types/doc'

@Entity('docs')
export class Doc {
  @PrimaryGeneratedColumn()
  id: number

  @Column('integer')
  userId: number

  @ManyToOne((type) => User, { eager: true })
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

  @Column('varchar')
  slug: string

  @Column('json')
  content: IDocContent

  @Column('integer')
  access: number

  @Column('boolean', { default: false })
  isLocked: boolean

  @Column('integer', { default: 0 })
  revision: number

  @Column({ type: 'timestamptz' })
  contentUpdatedAt: Date

  @Column('integer', { nullable: true })
  updatedBy: number

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date
}
