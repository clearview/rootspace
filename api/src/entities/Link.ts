import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn, Tree, TreeParent, TreeChildren } from 'typeorm'

@Entity('links')
@Tree('nested-set')
export class Link {

  @PrimaryGeneratedColumn()
  id: number

  @TreeChildren()
  children: Link[]

  @TreeParent()
  parent: Link

  @Column('integer')
  @Index()
  userId: number

  @Column('integer')
  @Index()
  spaceId: number

  @Column('varchar', { length: 100 })
  title: string

  @Column('varchar', { length: 20 })
  type: string

  @Column('varchar', { length: 150 })
  value: string

  @Column('json', { nullable: true })
  config: object

  @CreateDateColumn()
  created: string

  @UpdateDateColumn()
  updated: string

}