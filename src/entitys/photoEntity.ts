import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm';
import {User} from './userEntify'
// import { UUID } from 'crypto';
// import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Photo extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id!: string
    @Column({nullable: true})
    name!: string
    @Column({nullable: true})
    url!: string
    @Column({nullable: true})
    description!: string
    @ManyToOne(() => User, user => user.photo)
    user?: User
}