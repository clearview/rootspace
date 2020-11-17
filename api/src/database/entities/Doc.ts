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
  OneToMany,
} from 'typeorm'
import { User } from './User'
import { Space } from './Space'
import { IDocContent } from '../../types/doc'
import { DocRevision } from './DocRevision'

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
  content: object

  @Column('integer', { array: true })
  docState: number[]

  @Column('integer')
  access: number

  @Column('boolean', { default: false })
  isLocked: boolean

  @Column('integer', { default: 0 })
  revision: number

  @Column({ type: 'timestamptz' })
  contentUpdatedAt: Date

  @Column('integer', { nullable: true })
  contentUpdatedBy: number

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date

  @OneToMany(
    (type) => DocRevision,
    (revisions) => revisions.doc,
    { eager: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
  )
  revisions: DocRevision[]
}
