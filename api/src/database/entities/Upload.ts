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

  @Column('integer', { nullable: true })
  entityId: number

  @Column('varchar', { nullable: true })
  entity: string

  @Column('varchar', { nullable: true })
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
  @Column('json', { nullable: true })
  versions: object

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date
}