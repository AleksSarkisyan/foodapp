import * as Joi from 'joi';

export class FindRestaurantProductsDto {
    restaurantUserId: number;
    productIds: Array<number>;
}

export const findRestaurantProductsSchema = Joi.object({
    restaurantUserId: Joi.number().required(),
    productIds: Joi.array().required()
})
