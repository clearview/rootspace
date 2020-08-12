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
import { NodeType } from '../../types/node'

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
  type: NodeType

  @Column('json', { nullable: true })
  config: object

  @Column('integer', { default: 0 })
  position: number

  @CreateDateColumn({ type: 'timestamptz'})
  created: Date

  @UpdateDateColumn({ type: 'timestamptz'})
  updated: Date

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz'})
  public deletedAt: Date
}
