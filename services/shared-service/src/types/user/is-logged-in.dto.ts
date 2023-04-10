import * as Joi from 'joi';

export class IsLoggedIn {
    jwt: string;
}

export const isLoggedInSchema = Joi.object({
    jwt: Joi.string().required()
});


