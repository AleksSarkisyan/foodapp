import * as Joi from 'joi';

type OrderProducts = {
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
}

export class CreateOrderProductDto {
    products: OrderProducts[];
}

export const createOrderProductSchema = Joi.array().items(
    Joi.object({
        orderId: Joi.number().required(),
        productId: Joi.number().required(),
        quantity: Joi.number().required(),
        price: Joi.number().required()
    })
).required();

