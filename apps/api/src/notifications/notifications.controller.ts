import { Controller, Get, HttpCode, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { AuthUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/decorators';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationDto, UnreadCountDto } from './notifications.dto';

/** The signed-in user's in-app notifications. */
@ApiTags('notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOkResponse({ type: NotificationDto, isArray: true })
  async list(@CurrentUser() user: AuthUser): Promise<NotificationDto[]> {
    const rows = await this.prisma.notification.findMany({
      where: { userId: user.id, channel: 'in_app' },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return rows.map((n) => {
      const p = n.payload as { title?: string; body?: string; requestId?: string | null };
      return {
        id: n.id,
        template: n.template,
        title: p.title ?? '',
        body: p.body ?? '',
        requestId: p.requestId ?? null,
        readAt: n.readAt,
        createdAt: n.createdAt,
      };
    });
  }

  @Get('unread-count')
  @ApiOkResponse({ type: UnreadCountDto })
  async unreadCount(@CurrentUser() user: AuthUser): Promise<UnreadCountDto> {
    const count = await this.prisma.notification.count({
      where: { userId: user.id, channel: 'in_app', readAt: null },
    });
    return { count };
  }

  @Post(':id/read')
  @HttpCode(204)
  @ApiNoContentResponse()
  async markRead(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { id, userId: user.id, readAt: null },
      data: { readAt: new Date() },
    });
  }

  @Post('read-all')
  @HttpCode(204)
  @ApiNoContentResponse()
  async markAllRead(@CurrentUser() user: AuthUser): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { userId: user.id, channel: 'in_app', readAt: null },
      data: { readAt: new Date() },
    });
  }
}
