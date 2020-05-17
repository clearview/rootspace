import {Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn} from 'typeorm'

@Entity('docs')
export class Doc {

  @PrimaryGeneratedColumn()
  id: number

  @Column('integer', { nullable: true })
  @Index()
  userId: number

  @Column('integer')
  @Index()
  spaceId: number

  @Column('varchar')
  title: string

  @Column('json')
  content: object

  @Column('integer')
  access: number

  @Column('integer', { default: 0 })
  revision: number

  @CreateDateColumn()
  created: string

  @UpdateDateColumn()
  updated: string

}