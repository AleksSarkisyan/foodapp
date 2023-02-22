import { CanActivate, ExecutionContext, Inject, Logger, } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';

export class UserAuthorizedGuard implements CanActivate {
  constructor(@Inject('AUTH_SERVICE') public client: ClientProxy) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<any> {
    Logger.log('Auth Guard');
    const req = context.switchToHttp().getRequest();

    try {
      const res = this.client.send(
        { cmd: 'isLoggedIn' },
        { jwt: req.headers['authorization'] })
        .pipe(timeout(1000));

      return await firstValueFrom(res);
    } catch (err) {
      console.log('errro is', err)
      Logger.error(err);
      return false;
    }
  }
}