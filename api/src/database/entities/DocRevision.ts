import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('doc_revisions')
export class DocRevision {
  @PrimaryGeneratedColumn()
  id: number

  @Column('integer')
  userId: number

  @Column('integer')
  spaceId: number

  @Column('integer')
  revisionBy: number

  @Column('varchar')
  title: string

  @Column('varchar')
  slug: string

  @Column('json')
  content: object

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date
}
