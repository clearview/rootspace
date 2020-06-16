import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Generated
} from 'typeorm'
import { UserToSpace } from './UserToSpace'
import {Ability} from '@casl/ability'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar', { length: 100 })
  firstName: string

  @Column('varchar', { length: 100 })
  lastName: string

  @Column('varchar', { length: 100 })
  @Index({ unique: true })
  email: string

  @Column('varchar', { select: false })
  password: string

  @Column('varchar')
  authProvider: string

  @Column('boolean')
  active: boolean

  @Column('boolean', { default: false })
  emailConfirmed: boolean

  @Column()
  @Generated('uuid')
  @Index()
  token: string

  @CreateDateColumn()
  created: string

  @UpdateDateColumn()
  updated: string

  @OneToMany(type => UserToSpace, space => space.user)
  public spaces!: UserToSpace[]

  public ability: Ability
}
