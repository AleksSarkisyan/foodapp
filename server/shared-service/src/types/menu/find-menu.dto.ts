import * as Joi from 'joi';

export class FindMenuDto {
    restaurantId: number;
}

export const findMenuMenuSchema = Joi.object({
    restaurantId: Joi.number().required()
});
