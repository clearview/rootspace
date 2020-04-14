import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('sections')
export class Space {

  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar', { length: 100 })
  title: string

  @Column('integer')
  @Index()
  userId: number

  @Column('integer')
  @Index()
  spaceId: number

  @CreateDateColumn()
  created: string

  @UpdateDateColumn()
  updated: string

}