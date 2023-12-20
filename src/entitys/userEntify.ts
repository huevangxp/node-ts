import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity } from 'typeorm';
import { Photo } from './photoEntity';
import {v4 as uuid4} from 'uuid';

@Entity()
export class User extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id!: string;
    @Column({
        length: 20, 
        nullable: false
    })
    username!: string;
    @Column({ nullable: false })
    email!: string;
    @Column()
    password!: string;
    @OneToMany(() => Photo, photo => photo.user)
    photo?: Photo[];
}