import {Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn} from 'typeorm'

@Entity('users')
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column('varchar', { length: 100 })
    name: string

    @Column('varchar', { length: 100 })
    @Index({ unique: true })
    email: string
    
    @Column('varchar', { select: false })
    password: string

    @Column('varchar')
    auth_provider: string

    @Column('boolean')
    active: boolean

    @CreateDateColumn()
    created: string

    @UpdateDateColumn()
    updated: string

}