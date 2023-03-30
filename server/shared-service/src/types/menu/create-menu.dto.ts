import * as Joi from 'joi';

export class CreateMenuDto {
    userId: number;
    name: string;
    description: string;
    isActive: boolean;
}

export const createMenuSchema = Joi.object({
    userId: Joi.number().required(),
    name: Joi.string().required(),
    description: Joi.string().optional(),
    isActive: Joi.boolean().default(false)
})
