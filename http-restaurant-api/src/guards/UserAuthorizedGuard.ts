import { Types, Enums } from '@asarkisyan/nestjs-foodapp-shared';
import { CanActivate, ExecutionContext, Inject, Logger, mixin } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';


export const UserAuthorizedGuard = (serviceName: string) => {
  class UserAuthorized implements CanActivate {
    constructor(@Inject(serviceName) public client: ClientProxy) { }

    async canActivate(
      context: ExecutionContext,
    ): Promise<any> {
      Logger.log(serviceName);
      const req = context.switchToHttp().getRequest();

      try {
        const res = this.client.send(
          { cmd: Enums.RestaurantUser.Commands.IS_LOGGED_IN },
          { jwt: req.headers['authorization'] })
          .pipe(timeout(1000));

        return await firstValueFrom(res);
      } catch (err) {
        Logger.error(err);
        return false;
      }
    }
  }

  const guard = mixin(UserAuthorized);
  return guard;
}