import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Generated, ManyToOne, JoinColumn
} from 'typeorm'
import { TaskList } from './TaskList'
import { IsDate, IsInt, Length, Max, Min } from 'class-validator'
import { Tag } from './Tag'
import { User } from '../User'
import { Space } from '../Space'

export enum TaskBoardType {
  List = 1,
  Kanban = 2
}

@Entity('task_boards')
export class TaskBoard {

  @PrimaryGeneratedColumn()
  id: number

  @Column('uuid')
  @Generated('uuid')
  uuid: string

  @Column('integer')
  @Index()
  userId: number

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'userId' })
  @Index()
  user!: User

  @Column('integer')
  @Index()
  spaceId: number

  @ManyToOne((type) => Space)
  @JoinColumn({ name: 'spaceId' })
  @Index()
  space!: Space

  @Column('integer')
  @IsInt()
  @Min(1)
  @Max(2)
  type: TaskBoardType

  @Column('boolean', { default: false })
  isPublic: boolean

  @Column('varchar')
  @Length(2, 128)
  title: string

  @Column('text', { nullable: true })
  description: string

  @CreateDateColumn({ type: 'timestamptz'})
  @IsDate()
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz'})
  @IsDate()
  updatedAt: Date

  @OneToMany(type => Tag, tag => tag.board, {eager: true})
  tags!: Tag[]

  @OneToMany(type => TaskList, taskList => taskList.board, {eager: true})
  taskLists!: TaskList[]
}