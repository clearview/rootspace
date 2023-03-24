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

  @Column('integer', { default: 1 })
  role: number

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date

  @ManyToOne(
    (type) => User,
    (user) => user.userSpaces,
    { primary: true }
  )
  user: User

  @ManyToOne(
    (type) => Space,
    (space) => space.userSpaces,
    { primary: true }
  )
  space: Space
}
