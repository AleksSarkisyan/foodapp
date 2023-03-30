import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ObjectSchema } from 'joi';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
    constructor(private schema: ObjectSchema) {

    }

    transform(value: any, metadata: ArgumentMetadata) {
        console.log('Values -', value)
        const { error } = this.schema.validate(value);

        if (error) {
            console.log('Error -', error)
            throw new RpcException(error);
        }
        return value;
    }
}
