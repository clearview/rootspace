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
import { DocRevision } from './DocRevision'

@Entity('docs')
export class Doc {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar')
  publicId: string

  @Column('integer')
  userId: number

  @ManyToOne((type) => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  @Index()
  user!: User

  @Column('integer')
  spaceId: number

  @ManyToOne((type) => Space, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'spaceId' })
  @Index()
  space!: Space

  @Column('varchar')
  title: string

  @Column('varchar')
  slug: string

  @Column('json')
  content: object

  @Column('int', { array: true })
  contentState: number[]

  @Column('int', { array: true })
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
