import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Tree,
  TreeParent,
  TreeChildren,
} from 'typeorm'

@Entity('nodes')
@Tree('nested-set')
export class Node {
  @PrimaryGeneratedColumn()
  id: number

  @TreeChildren()
  children: Node[]

  @TreeParent()
  parent: Node

  @Column('integer', { nullable: true })
  @Index()
  parentId: number

  @Column('integer', { nullable: true })
  restoreParentId: number

  @Column('integer')
  @Index()
  userId: number

  @Column('integer')
  @Index()
  spaceId: number

  @Column('integer')
  contentId: number

  @Column('varchar', { length: 100 })
  title: string

  @Column('varchar', { length: 20 })
  type: string

  @Column('integer', { default: 0 })
  position: number

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date

  @DeleteDateColumn({ type: 'timestamptz' })
  public deletedAt: Date
}
