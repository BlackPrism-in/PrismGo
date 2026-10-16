import { Body, Controller, Delete, HttpCode, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
import type { AuthUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/decorators';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDeviceDto } from './notifications.dto';

/** Push tokens of the signed-in user's devices (mobile app). */
@ApiTags('notifications')
@ApiBearerAuth()
@Controller('devices')
export class DevicesController {
  constructor(private readonly prisma: PrismaService) {}

  /** Called after login and whenever FCM rotates the token. A token moves to whoever signs in on that device. */
  @Post()
  @HttpCode(204)
  @ApiNoContentResponse()
  async register(@CurrentUser() user: AuthUser, @Body() dto: RegisterDeviceDto): Promise<void> {
    await this.prisma.deviceToken.upsert({
      where: { token: dto.token },
      create: { token: dto.token, platform: dto.platform, userId: user.id },
      update: { platform: dto.platform, userId: user.id },
    });
  }

  /** Called on logout so the device stops receiving this user's notifications. */
  @Delete(':token')
  @HttpCode(204)
  @ApiNoContentResponse()
  async unregister(@CurrentUser() user: AuthUser, @Param('token') token: string): Promise<void> {
    await this.prisma.deviceToken.deleteMany({ where: { token, userId: user.id } });
  }
}
