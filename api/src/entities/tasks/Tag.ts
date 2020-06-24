import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
} from 'typeorm'
import { TaskBoard } from './TaskBoard'

@Entity('task_board_tags')
export class Tag {

  @PrimaryGeneratedColumn()
  id: number

  @Column('integer')
  @Index()
  boardId: number

  @Column('varchar')
  label: string

  @Column('varchar')
  color: string

  @ManyToOne(type => TaskBoard, board => board.tags, {onDelete: 'CASCADE'})
  board!: TaskBoard
}