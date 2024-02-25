import { Inject, OnModuleInit, UseGuards } from '@nestjs/common';
import { OnGatewayConnection, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from '../guards/ws-jwt.guard';
import { ClientKafka } from '@nestjs/microservices';
import { AUTH_SERVICE } from '../kafka/kafka.const';
import { ERROR_UNAUTHORIZED } from '../common/error.const';
import { IUser } from '../common/user.interface';
import { IPost } from '../common/post.interface';
import { RedisClientType } from 'redis';
import { REDIS_SRC } from '../redis/redis.const';
import { OnEvent } from '@nestjs/event-emitter';

@UseGuards(WsJwtGuard)
@WebSocketGateway({
  namespace: '/post/feed/posted',
})
export class PostGateway implements OnGatewayConnection, OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientKafka,
    @Inject(REDIS_SRC) private readonly redisClient: RedisClientType,
  ) {}

  onModuleInit() {
    this.authClient.subscribeToResponseOf('authenticate');
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.headers.authorization?.split(' ')[1];
      const user = await this.authClient.send<IUser>('authenticate', { token }).toPromise();
      await this.redisClient.set(`userSocketSession:${user.id}`, client.id);

      client.on('disconnect', () => {
        this.redisClient.del(`userSocketSession:${user.id}`); // Удаляем при отключении
      });
    } catch (error) {
      throw new WsException(ERROR_UNAUTHORIZED);
    }
  }

  @OnEvent('post.changes')
  async sendPostToUser(user: IUser, post: IPost) {
    const clientSocketId = await this.redisClient.get(`userSocketSession:${user.id}`);
    if (clientSocketId) {
      this.server.to(clientSocketId).emit('postFeedPosted', post);
    }
  }
}
