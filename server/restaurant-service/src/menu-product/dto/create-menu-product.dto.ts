import * as Joi from 'joi';

export class CreateMenuProductDto {
    userId: number;
    menuId: number;
    productId: number;
    token: string;
}

export const createMenuProductSchema = Joi.object({
    menuId: Joi.number().required(),
    productId: Joi.number().required(),
    token: Joi.string().required()
})
