import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
} from 'typeorm'

@Entity('password_resets')
export class PasswordReset {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar', { length: 255 })
  email: string

  @Column()
  @Generated('uuid')
  @Index()
  token: string

  @Column('timestamp')
  expiration: Date

  @Column('boolean')
  @Index()
  active: boolean

  @CreateDateColumn({ type: 'timestamptz'})
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz'})
  updatedAt: Date

  @Column('text')
  urlQueryParams: string
}
