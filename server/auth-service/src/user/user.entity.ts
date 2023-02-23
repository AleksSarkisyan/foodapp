import { Entity, Property, Unique, EntityRepositoryType, BeforeCreate } from "@mikro-orm/core";
import { IsEmail } from "class-validator";
import { BaseEntity } from '../BaseEntity';
import crypto from 'crypto';
import { UserRepository } from './user.repository';
import { hash } from 'bcrypt';


// @Entity({ customRepository: () => UserRepository })
@Entity()
@Unique({ properties: ['email'] })
export class User extends BaseEntity {

    // [EntityRepositoryType]?: UserRepository;

    @Property()
    name!: string;

    @Property()
    @IsEmail()
    email!: string;

    @Property()
    password!: string;

    // @BeforeCreate()
    // async hashPassword() {
    //     this.password = await hash(this.password, 10);
    // }

    constructor(name: string, email: string, password: string) {
        super();
        this.name = name;
        this.email = email;
        // this.password = crypto.createHmac('sha256', password).digest('hex');
        this.password = password;
    }
}