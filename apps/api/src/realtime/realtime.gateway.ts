import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import type { AccessTokenPayload } from '../auth/auth.types';
import { API_PREFIX } from '../setup-app';

export const rooms = {
  user: (userId: string) => `user:${userId}`,
  /** Transport managers and super admins of an organisation. */
  managers: (orgId: string) => `org:${orgId}:managers`,
};

/**
 * Socket.IO at /api/v1/socket.io. Clients pass the access token as `auth.token`.
 * Every socket joins its user room; managers also join the org managers room.
 * Server → client events: `notification`, `request.updated`.
 */
@WebSocketGateway({ path: `/${API_PREFIX}/socket.io`, cors: { origin: true, credentials: true } })
export class RealtimeGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(RealtimeGateway.name);

  constructor(private readonly jwt: JwtService) {}

  async handleConnection(socket: Socket): Promise<void> {
    const token = socket.handshake.auth?.['token'] as string | undefined;
    try {
      if (!token) throw new Error('missing token');
      const payload = await this.jwt.verifyAsync<AccessTokenPayload>(token);
      await socket.join(rooms.user(payload.sub));
      if (payload.roles.some((r) => r === 'transport_manager' || r === 'super_admin')) {
        await socket.join(rooms.managers(payload.org));
      }
    } catch {
      socket.emit('unauthorized');
      socket.disconnect(true);
    }
  }

  emit(room: string | string[], event: string, payload: unknown): void {
    if (!this.server) {
      this.logger.warn(`Socket server not ready; dropped ${event}`);
      return;
    }
    this.server.to(room).emit(event, payload);
  }
}
