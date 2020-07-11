import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Generated,
} from 'typeorm'
import { UserToSpace } from './UserToSpace'
import { Ability } from '@casl/ability'
import { Follow } from './Follow'
import { Notification } from './Notification'
import { Length } from 'class-validator'

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
  @Length(3)
  password: string

  @Column('varchar', { length: 254, nullable: true })
  avatar: string

  @Column('varchar', { select: false })
  authProvider: string

  @Column('boolean')
  active: boolean

  @Column('boolean', { default: false, select: false })
  emailConfirmed: boolean

  @Column({ select: false })
  @Generated('uuid')
  @Index()
  token: string

  @CreateDateColumn({ select: false })
  created: string

  @UpdateDateColumn({ select: false })
  updated: string

  @OneToMany(
    (type) => UserToSpace,
    (space) => space.user
  )
  public spaces!: UserToSpace[]

  @OneToMany(type => Follow, follow => follow.user, {eager: false, onDelete: 'CASCADE'})
  public follows!: Follow[]

  @OneToMany(type => Notification, notification => notification.user, {eager: false, onDelete: 'CASCADE'})
  public notifications!: Notification[]

  @OneToMany(type => Notification, action => action.user, {eager: false, onDelete: 'CASCADE'})
  public actions!: Notification[]

  public ability: Ability
}
