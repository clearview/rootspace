import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('uploads')
export class Upload {
  @PrimaryGeneratedColumn()
  id: number

  @Column('integer')
  @Index()
  userId: number

  @Column('integer')
  @Index()
  spaceId: number

  @Column('varchar')
  entity: string

  @Column('integer')
  entityId: number

  @Column('varchar')
  contentType: string

  @Column('varchar')
  type: string

  @Column('varchar')
  path: string

  @Column('json', { nullable: true })
  versions: object

  @Column('varchar')
  mimetype: string

  @Column('integer')
  size: number

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date
}
