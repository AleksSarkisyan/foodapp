import { Catch, RpcExceptionFilter, ArgumentsHost, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';


@Catch(RpcException)
export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
    catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
        let errorObject = {
            error: true,
            message: exception.message
        }
        Logger.log(errorObject);
        return throwError(() => JSON.stringify(errorObject));
    }
}