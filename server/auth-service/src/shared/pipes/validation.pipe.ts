import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!value) {
            throw new BadRequestException('No data submitted!');
        }

        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }

        const object = plainToInstance(metatype, value);
        const errors = await validate(object);

        if (errors.length > 0) {
            throw new HttpException({
                message: 'Data validation failed',
                errors: this.buildError(errors)
            }, HttpStatus.BAD_REQUEST);
        }

        return value;
    }

    private buildError(errors) {
        const result = {};
        errors.forEach((el) => {
            const prop = el.property;
            Object.entries(el.constraints).forEach((constraint) => {
                result[prop + constraint[0]] = `${constraint[1]}`;
            });
        });
        return result;
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}