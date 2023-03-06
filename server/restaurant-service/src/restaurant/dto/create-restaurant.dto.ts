import * as Joi from 'joi';

export class CreateRestaurantDto {
    userId: number;
    menuId: number;
    name: string;
    city: string;
}

export const createRestaurantSchema = Joi.object({
    userId: Joi.number().required(),
    menuId: Joi.number().optional(),
    name: Joi.string().required(),
    city: Joi.string().required(),
})
