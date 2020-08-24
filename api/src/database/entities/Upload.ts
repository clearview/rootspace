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
  mime: string

  @Column('integer')
  size: number

  @Column('varchar')
  path: string

  @CreateDateColumn({ type: 'timestamptz'})
  createdAt: Date
  @Column('json', { nullable: true })
  versions: object

  @CreateDateColumn()
  created: string

  @UpdateDateColumn({ type: 'timestamptz'})
  updatedAt: Date
