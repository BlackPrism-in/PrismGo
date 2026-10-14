import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { AuthUser } from '../auth/auth.types';
import { CurrentUser, Roles } from '../auth/decorators';
import { CreateUserDto, ListUsersQuery, UpdateUserDto, UserDto } from './users.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@Roles('super_admin', 'transport_manager')
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  @ApiOkResponse({ type: UserDto, isArray: true })
  list(@CurrentUser() user: AuthUser, @Query() query: ListUsersQuery): Promise<UserDto[]> {
    return this.users.list(user, query);
  }

  @Get(':id')
  @ApiOkResponse({ type: UserDto })
  get(@CurrentUser() user: AuthUser, @Param('id', ParseUUIDPipe) id: string): Promise<UserDto> {
    return this.users.get(user, id);
  }

  @Post()
  @ApiCreatedResponse({ type: UserDto })
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateUserDto): Promise<UserDto> {
    return this.users.create(user, dto);
  }

  @Patch(':id')
  @ApiOkResponse({ type: UserDto })
  update(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserDto> {
    return this.users.update(user, id, dto);
  }
}
