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
import { UserSetting } from './UserSetting'
import { Task } from './tasks/Task'
import { Length } from 'class-validator'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar', { length: 100 })
  firstName: string

  @Column('varchar', { length: 100 })
  lastName: string

  fullName(): string | undefined {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`
    }

    return this.email
  }

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

  @CreateDateColumn({ type: 'timestamptz', select: false })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz', select: false })
  updatedAt: Date

  @OneToMany((type) => UserToSpace, (space) => space.user)
  public spaces!: UserToSpace[]

  @OneToMany(type => Follow, follow => follow.user, {eager: false, onDelete: 'CASCADE'})
  public follows!: Follow[]

  @OneToMany(type => Notification, notification => notification.user, {eager: false, onDelete: 'CASCADE'})
  public notifications!: Notification[]

  @OneToMany(type => UserSetting, setting => setting.user, {eager: false, onDelete: 'CASCADE'})
  public settings!: UserSetting[]

  @OneToMany(type => Task, task => task.user, {eager: false, onDelete: 'CASCADE'})
  public tasks: Task[]

  public ability: Ability
}
