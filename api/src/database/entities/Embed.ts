import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('embed')
export class Embed {
  @PrimaryGeneratedColumn()
  id: number

  @Column('integer')
  @Index()
  userId: number

  @Column('integer')
  @Index()
  spaceId: number

  @Column('varchar')
  title: string

  @Column('text')
  content: string

  @CreateDateColumn()
  created: Date

  @UpdateDateColumn()
  updated: Date
}
