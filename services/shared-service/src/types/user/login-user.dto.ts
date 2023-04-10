import * as Joi from 'joi';

export class LoginUser {
  email: string;
  password: string;
}

export const loginUserSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
})
