import * as Joi from 'joi';

export class CreateProductDto {
    userId: number;
    categoryId: number;
    name: string;
    description: string;
    price: number;
    promoPrice: number;
    imageUrl: string;
    slug: string;
    weight: string;
    isPromo: boolean
    isActive: boolean;
    token: string;
}

export const createProductSchema = Joi.object({
    categoryId: Joi.number().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    promoPrice: Joi.number().optional().default(null),
    imageUrl: Joi.string().optional().default(null).allow('', null),
    slug: Joi.string().optional().default(null).allow('', null),
    weight: Joi.string().required(),
    isPromo: Joi.boolean().optional().default(false),
    isActive: Joi.boolean().optional().default(true),
    token: Joi.string().required()
})

export class FindRestaurantProductsDto {
    restaurantUserId: number;
    productIds: Array<number>;
}

export const findRestaurantProductsSchema = Joi.object({
    restaurantUserId: Joi.number().required(),
    productIds: Joi.array().required()
})
