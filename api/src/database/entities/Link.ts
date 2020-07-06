import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('links')
export class Link {
  @PrimaryGeneratedColumn()
  id: number

  @Column('integer')
  @Index()
  userId: number

  @Column('integer')
  @Index()
  spaceId: number

  @Column('varchar', { length: 100 })
  title: string

  @Column('varchar', { length: 150 })
  value: string

  @CreateDateColumn()
  created: string

  @UpdateDateColumn()
  updated: string
}
