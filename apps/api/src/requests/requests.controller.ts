import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { AuthUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/decorators';
import {
  ApproveDto,
  CancelDto,
  CreateRequestDto,
  ListRequestsQuery,
  RejectDto,
  RequestDto,
  UpdateRequestDto,
} from './requests.dto';
import { RequestsService } from './requests.service';

/**
 * Role checks live in the service because they depend on the request itself
 * (its requester and its department's HOD), not only on the caller's role.
 */
@ApiTags('requests')
@ApiBearerAuth()
@Controller('requests')
export class RequestsController {
  constructor(private readonly requests: RequestsService) {}

  @Get()
  @ApiOkResponse({ type: RequestDto, isArray: true })
  list(@CurrentUser() user: AuthUser, @Query() query: ListRequestsQuery): Promise<RequestDto[]> {
    return this.requests.list(user, query);
  }

  @Get(':id')
  @ApiOkResponse({ type: RequestDto })
  get(@CurrentUser() user: AuthUser, @Param('id', ParseUUIDPipe) id: string): Promise<RequestDto> {
    return this.requests.get(user, id);
  }

  @Post()
  @ApiCreatedResponse({ type: RequestDto })
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateRequestDto): Promise<RequestDto> {
    return this.requests.create(user, dto);
  }

  @Patch(':id')
  @ApiOkResponse({ type: RequestDto })
  update(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRequestDto,
  ): Promise<RequestDto> {
    return this.requests.update(user, id, dto);
  }

  @Post(':id/submit')
  @HttpCode(200)
  @ApiOkResponse({ type: RequestDto })
  submit(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RequestDto> {
    return this.requests.submit(user, id);
  }

  @Post(':id/cancel')
  @HttpCode(200)
  @ApiOkResponse({ type: RequestDto })
  cancel(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CancelDto,
  ): Promise<RequestDto> {
    return this.requests.cancel(user, id, dto.reason);
  }

  @Post(':id/approve')
  @HttpCode(200)
  @ApiOkResponse({ type: RequestDto })
  approve(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ApproveDto,
  ): Promise<RequestDto> {
    return this.requests.approve(user, id, dto.comment);
  }

  @Post(':id/reject')
  @HttpCode(200)
  @ApiOkResponse({ type: RequestDto })
  reject(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RejectDto,
  ): Promise<RequestDto> {
    return this.requests.reject(user, id, dto.comment);
  }
}
