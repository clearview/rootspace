import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne, JoinColumn,
} from 'typeorm'
import { TaskBoard } from './TaskBoard'

@Entity('task_board_tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(type => TaskBoard, board => board.tags, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'boardId' })
  @Index()  board!: TaskBoard

  @Column('varchar')
  label: string

  @Column('varchar')
  color: string
}