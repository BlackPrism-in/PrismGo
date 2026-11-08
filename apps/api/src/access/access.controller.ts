import { Body, Controller, Get, HttpCode, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { AuthUser } from '../auth/auth.types';
import { CurrentUser, Public, Roles } from '../auth/decorators';
import {
  AccessRequestDto,
  AccessRequestReceivedDto,
  CreateAccessRequestDto,
  SignupDepartmentDto,
} from './access.dto';
import { AccessService } from './access.service';

@ApiTags('access')
@Controller('access')
export class AccessController {
  constructor(private readonly access: AccessService) {}

  /** Public: the sign-up form's department picker. */
  @Public()
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @Get('departments')
  @ApiOkResponse({ type: SignupDepartmentDto, isArray: true })
  departments(): Promise<SignupDepartmentDto[]> {
    return this.access.departments();
  }

  /** Public: a new employee asks for access from the login screen. */
  @Public()
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @Post('requests')
  @HttpCode(202)
  @ApiOkResponse({ type: AccessRequestReceivedDto })
  request(@Body() dto: CreateAccessRequestDto): Promise<AccessRequestReceivedDto> {
    return this.access.request(dto);
  }

  @ApiBearerAuth()
  @Roles('hod', 'super_admin', 'transport_manager')
  @Get('requests')
  @ApiOkResponse({ type: AccessRequestDto, isArray: true })
  list(@CurrentUser() user: AuthUser): Promise<AccessRequestDto[]> {
    return this.access.list(user);
  }

  @ApiBearerAuth()
  @Roles('hod', 'super_admin', 'transport_manager')
  @Post('requests/:id/approve')
  @HttpCode(200)
  @ApiOkResponse({ type: AccessRequestDto })
  approve(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AccessRequestDto> {
    return this.access.approve(user, id);
  }

  @ApiBearerAuth()
  @Roles('hod', 'super_admin', 'transport_manager')
  @Post('requests/:id/reject')
  @HttpCode(204)
  reject(@CurrentUser() user: AuthUser, @Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.access.reject(user, id);
  }
}
