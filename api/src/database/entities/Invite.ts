import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm'

@Entity('invites')
export class Invite {
  @PrimaryGeneratedColumn()
  id: number

  @Column('integer', { nullable: true })
  @Index()
  userId: number

  @Column('integer')
  @Index()
  spaceId: number

  @Column('integer')
  senderId: number

  @Column('varchar', { length: 100 })
  @Index()
  email: string

  @Column()
  @Generated('uuid')
  @Index()
  token: string

  @Column('boolean', { default: false })
  accepted: boolean

  @Column('timestamp', { nullable: true })
  acceptedDate: Date

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date
}
