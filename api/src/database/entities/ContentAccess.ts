import { Entity, PrimaryGeneratedColumn, Column, Index, OneToOne, JoinColumn } from 'typeorm'
import { Node } from './Node'

@Entity('content_access')
export class ContentAccess {
  @PrimaryGeneratedColumn()
  id: number

  @Column('integer')
  spaceId: number

  @Column('integer')
  ownerId: number

  @Column('integer')
  @Index()
  nodeId: number

  @Column('integer')
  @Index()
  entityId: number

  @Column('varchar')
  @Index()
  entity: string

  @Column('varchar')
  type: string

  @Column('boolean')
  public: boolean

  @OneToOne(
    () => Node,
    (node) => node.contentAccess
  )
  @JoinColumn()
  node: Node
}
