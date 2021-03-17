import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { UserToSpace } from './UserToSpace'

@Entity('spaces')
export class Space {
  @PrimaryGeneratedColumn()
  id: number

  @Column('integer')
  @Index()
  userId: number

  @Column('varchar', { length: 100 })
  title: string

  @Column('json', { nullable: true })
  settings: object

  @Column('integer', { default: 1 })
  countMembers: number

  @Column('boolean', { default: true })
  active: boolean

  @CreateDateColumn({ type: 'timestamptz'})
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz'})
  updatedAt: Date

  @OneToMany(
    (type) => UserToSpace,
    (userSpace) => userSpace.space
  )
  userSpaces: UserToSpace[]
}
