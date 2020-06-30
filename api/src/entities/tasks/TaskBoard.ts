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
import { TaskList } from './TaskList'
import { IsDate, IsInt, Length, Max, Min } from 'class-validator'

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

  @Column('integer')
  @Index()
  spaceId: number

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

  @OneToMany(type => TaskList, taskList => taskList.board, {eager: true})
  taskLists: TaskList[]
}