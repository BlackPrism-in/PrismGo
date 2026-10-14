import { Body, Controller, Get, HttpCode, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { AuthUser } from '../auth/auth.types';
import { CurrentUser, Roles } from '../auth/decorators';
import { RequestDto } from '../requests/requests.dto';
import { AssignDto, AvailabilityDto, AvailabilityQuery, ReassignDto } from './assignments.dto';
import { AssignmentsService } from './assignments.service';

@ApiTags('assignments')
@ApiBearerAuth()
@Roles('transport_manager', 'super_admin')
@Controller()
export class AssignmentsController {
  constructor(private readonly assignments: AssignmentsService) {}

  @Get('availability')
  @ApiOkResponse({ type: AvailabilityDto })
  availability(
    @CurrentUser() user: AuthUser,
    @Query() q: AvailabilityQuery,
  ): Promise<AvailabilityDto> {
    return this.assignments.availability(user, q.from, q.to, q.passengers);
  }

  @Post('requests/:id/assign')
  @HttpCode(200)
  @ApiOkResponse({ type: RequestDto })
  assign(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignDto,
  ): Promise<RequestDto> {
    return this.assignments.assign(user, id, dto);
  }

  @Post('trips/:id/reassign')
  @HttpCode(200)
  @ApiOkResponse({ type: RequestDto })
  reassign(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ReassignDto,
  ): Promise<RequestDto> {
    return this.assignments.reassign(user, id, dto);
  }
}
