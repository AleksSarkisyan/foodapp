import { Entity, Property, Unique, EntityRepositoryType } from "@mikro-orm/core";
import { IsEmail } from "class-validator";
import { BaseEntity } from '../BaseEntity';
import crypto from 'crypto';
import { UserRepository } from './user.repository';

@Entity({ customRepository: () => UserRepository })
@Unique({ properties: ['email'] })
export class User extends BaseEntity {

    [EntityRepositoryType]?: UserRepository;

    @Property()
    name!: string;

    @Property()
    @IsEmail()
    email!: string;

    @Property()
    password!: string;

    constructor(name: string, email: string, password: string) {
        super();
        this.name = name;
        this.email = email;
        this.password = crypto.createHmac('sha256', password).digest('hex');
    }
}