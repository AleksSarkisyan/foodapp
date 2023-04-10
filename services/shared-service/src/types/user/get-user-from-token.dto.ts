import * as Joi from 'joi';

export class GetUserFromToken {
    token: string;
}

export const getUserFromTokenSchema = Joi.object({
    token: Joi.string().required()
})



