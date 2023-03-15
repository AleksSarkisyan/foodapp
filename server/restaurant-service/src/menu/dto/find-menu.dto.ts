import * as Joi from 'joi';

export class FindMenuDto {
    menuId: number;
}

export const findMenuMenuSchema = Joi.object({
    menuId: Joi.number().required()
});
