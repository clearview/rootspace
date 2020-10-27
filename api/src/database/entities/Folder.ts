import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm'

@Entity('folders')
export class Folder {
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

  @CreateDateColumn({ type: 'timestamptz'})
  createdAt: Date

  @DeleteDateColumn({ type: 'timestamptz'})
  public deletedAt: Date
}
