import * as Joi from 'joi';

export class CreateUserDto {
    name: string;
    email: string;
    password: string;
}

export const createUserSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
})
