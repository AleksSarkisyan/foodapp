import * as Joi from 'joi';

type OrderProducts = {
    productId: number;
    quantity: number;
}

export class CreateOrderDto {
    userId: number;
    products: OrderProducts[];
    totalPrice: number;
    totalQuantity: number;
    restaurantId: number;
    token: string;
}

export const createOrderSchema = Joi.object({
    userId: Joi.number().required(),
    products: Joi.array().required(),
    totalPrice: Joi.number().optional(),
    totalQuantity: Joi.number().optional(),
    restaurantId: Joi.number().required(),
})
