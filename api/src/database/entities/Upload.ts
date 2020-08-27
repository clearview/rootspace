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
  type: string

  @Column('integer')
  size: number

  @Column('varchar')
  path: string

  @CreateDateColumn({ type: 'timestamptz'})
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz'})
  updatedAt: Date

}