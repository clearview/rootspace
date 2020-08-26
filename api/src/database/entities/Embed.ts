import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm'

@Entity('embeds')
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

  @Column('varchar')
  type: string

  @Column('text')
  content: string

  @CreateDateColumn()
  created: Date

  @UpdateDateColumn()
  updated: Date

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  public deletedAt: Date
}
