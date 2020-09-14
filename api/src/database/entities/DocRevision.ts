import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'
import { IDocContent } from '../../types/doc'

@Entity('doc_revisions')
export class DocRevision {
  @PrimaryGeneratedColumn()
  id: number

  @Column('integer')
  docId: number

  @Column('integer')
  userId: number

  @Column('integer')
  spaceId: number

  @Column('varchar')
  title: string

  @Column('varchar')
  slug: string

  @Column('json')
  content: IDocContent

  @Column('integer')
  revisionBy: number

  @Column({ type: 'timestamptz' })
  revisionAt: Date
}
