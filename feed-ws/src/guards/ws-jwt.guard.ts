import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class WsJwtGuard implements CanActivate {
  //constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient();
    const token = client.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      return false;
    }
    console.log(token);
    return true;
    // return this.authClient
    //   .send<UserDto>('authenticate', {
    //     Authentication: jwt,
    //   })
    //   .pipe(
    //     tap((res) => {
    //       context.switchToHttp().getRequest().user = res;
    //     }),
    //     map(() => true),
    //   );
  }
}
