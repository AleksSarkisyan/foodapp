import * as Joi from 'joi';
import { CreateRestaurantDto } from './create-restaurant.dto';

export type UpdateRestaurantDto = Omit<CreateRestaurantDto, "userId"> & {
    restaurantId: number;
    token: string;
}

export const updateRestaurantSchema = Joi.object({
    menuId: Joi.number().required(),
    restaurantId: Joi.number().required(),
    name: Joi.string().required(),
    city: Joi.string().required(),
    token: Joi.string().required()
})
