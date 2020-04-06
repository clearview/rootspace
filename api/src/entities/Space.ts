import {Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn} from 'typeorm'

@Entity('spaces')
export class Space {

    @PrimaryGeneratedColumn()
    id: number

    @Column('integer')
    @Index()
    user_id: string

    @Column('varchar', { length: 100 })
    title: string

    @Column('json', { nullable: true })
    settings: object

    @CreateDateColumn()
    created: string

    @UpdateDateColumn()
    updated: string

}