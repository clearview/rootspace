import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm'
import { IDocContent } from '../../types/doc'
import { Doc } from './Doc'
import { User } from './User'

@Entity('doc_revisions')
export class DocRevision {
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

  @Column('integer')
  docId: number

  @Column('json')
  content: IDocContent

  @Column('integer')
  number: number

  @Column('integer')
  revisionBy: number

  @Column({ type: 'timestamptz' })
  revisionAt: Date

  @ManyToOne(
    (type) => Doc,
    (doc) => doc.revisions
  )
  doc: Doc
}
