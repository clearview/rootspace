import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm'
import { IDocContent } from '../../types/doc'
import { Doc } from './Doc'

@Entity('doc_revisions')
export class DocRevision {
  @PrimaryGeneratedColumn()
  id: number

  @Column('integer')
  userId: number

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
