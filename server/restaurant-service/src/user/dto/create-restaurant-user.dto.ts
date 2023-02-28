import * as Joi from 'joi';

export class CreateRestaurantUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const createRestaurantUserSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string().required(),
})
