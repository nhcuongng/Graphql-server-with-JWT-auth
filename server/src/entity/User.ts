import { Field, ObjectType } from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";
@ObjectType()
@Entity("User")
export class User extends BaseEntity {

    @Field(() => Number)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => String)
    @Column()
    email: string;

    @Column()
    password: string;

}
