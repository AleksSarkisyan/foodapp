import { Entity, Property, Unique } from "@mikro-orm/core";
import { BaseEntity } from './BaseEntity';

@Entity()
@Unique({ properties: ['email'] })
export class User extends BaseEntity {

    @Property()
    name!: string;

    @Property()
    email!: string;

    @Property()
    password!: string;
}