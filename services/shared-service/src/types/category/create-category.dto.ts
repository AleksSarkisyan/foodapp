import * as Joi from 'joi';

export class CreateCategoryDto {
    name: string;
    description: string;
    slug: string;
}

export const createCategorySchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    slug: Joi.string().optional()
})

