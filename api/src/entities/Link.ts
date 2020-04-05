import {Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn} from 'typeorm'

@Entity('links')
export class Link {

    @PrimaryGeneratedColumn()
    id: number

    @Column('integer')
    @Index()
    user_id: number

    @Column('integer')
    @Index()
    space_id: number

    @Column('varchar', { length: 100 })
    title: string

    @Column('varchar', { length: 20 })
    type: string

    @Column('varchar', { length: 150 })
    value: string

    @Column('json', { nullable: true })
    config: object

    @CreateDateColumn()
    created: string

    @UpdateDateColumn()
    updated: string

}