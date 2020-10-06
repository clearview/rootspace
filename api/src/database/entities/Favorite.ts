import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn } from 'typeorm'

@Entity('favorites')
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number

  @Column('integer')
  @Index()
  userId: number

  @Column('integer')
  spaceId: number

  @Column('integer')
  nodeId: number

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date
}
