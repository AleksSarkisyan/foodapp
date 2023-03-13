import * as Joi from 'joi';

export class CreateRestaurantDto {
    userId: number;
    menuId: number;
    name: string;
    city: string;
    token: string;
}

export const createRestaurantSchema = Joi.object({
    menuId: Joi.number().optional(),
    name: Joi.string().required(),
    city: Joi.string().required(),
    token: Joi.string().required()
})
