import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  Tree,
  TreeParent,
  TreeChildren,
} from 'typeorm'

export enum NodeType {
  Undefined = 'undefined',
  Root = 'root',
  Document = 'doc',
  TaskBoard = 'taskBoard',
}

@Entity('links')
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

  @Column('integer')
  @Index()
  userId: number

  @Column('integer')
  @Index()
  spaceId: number

  @Column('varchar', { length: 100 })
  title: string

  @Column('varchar', { length: 20 })
  type: NodeType

  @Column('varchar', { length: 150 })
  content: string

  @Column('json', { nullable: true })
  config: object

  @Column('integer', { default: 0 })
  position: number

  @CreateDateColumn()
  created: string

  @UpdateDateColumn()
  updated: string
}
