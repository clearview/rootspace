import {Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn} from 'typeorm'

@Entity('sections')
export class Space {

    @PrimaryGeneratedColumn()
    id: number

    @Column('varchar', { length: 100 })
    title: string

    @Column('integer')
    @Index()
    user_id: number

    @Column('integer')
    @Index()
    space_id: number

    @CreateDateColumn()
    created: string

    @UpdateDateColumn()
    updated: string

}