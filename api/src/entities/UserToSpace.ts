import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { User } from './User'
import { Space } from './Space'

@Entity('users_spaces')
export class UserToSpace {

  @PrimaryGeneratedColumn()
  public id!: number

  @Column()
  @Index()
  public userId!: number

  @Column()
  @Index()
  public spaceId!: number

  @Column('boolean', { default: true })
  active: boolean

  @CreateDateColumn()
  created: string

  @UpdateDateColumn()
  updated: string

  @ManyToOne(type => User, user => user.spaces)
  public user!: User

  @ManyToOne(type => Space, space => space.users)
  public space!: Space

}