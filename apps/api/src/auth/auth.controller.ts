import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { CookieOptions, Request, Response } from 'express';
import { API_PREFIX } from '../setup-app';
import {
  AuthResponseDto,
  MeDto,
  RefreshDto,
  RequestOtpDto,
  RequestOtpResponseDto,
  VerifyOtpDto,
} from './auth.dto';
import { AuthService } from './auth.service';
import type { AuthUser } from './auth.types';
import { CurrentUser, Public } from './decorators';
import { TokensService, type TokenPair } from './tokens.service';

const REFRESH_COOKIE = 'pg_rt';

/** Web clients send `X-Client: web` and get the refresh token as an httpOnly cookie. */
@ApiTags('auth')
@ApiHeader({ name: 'X-Client', required: false, description: '"web" for browser sessions' })
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly tokens: TokensService,
    private readonly config: ConfigService,
  ) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('otp/request')
  @HttpCode(200)
  @ApiOkResponse({ type: RequestOtpResponseDto })
  requestOtp(@Body() dto: RequestOtpDto): Promise<RequestOtpResponseDto> {
    return this.auth.requestOtp(dto.phone);
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('otp/verify')
  @HttpCode(200)
  @ApiOkResponse({ type: AuthResponseDto })
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Headers('x-client') client: string | undefined,
    @Headers('user-agent') userAgent: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const { user, ...pair } = await this.auth.verifyOtp(dto.phone, dto.code, userAgent);
    return { ...this.deliverTokens(pair, client, res), user };
  }

  @Public()
  @Post('refresh')
  @HttpCode(200)
  @ApiOkResponse({ type: AuthResponseDto })
  async refresh(
    @Body() dto: RefreshDto,
    @Req() req: Request,
    @Headers('x-client') client: string | undefined,
    @Headers('user-agent') userAgent: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<AuthResponseDto, 'user'>> {
    const token = dto.refreshToken ?? (req.cookies?.[REFRESH_COOKIE] as string | undefined);
    if (!token) throw new UnauthorizedException('Session expired. Log in again.');
    const pair = await this.tokens.rotate(token, userAgent);
    return this.deliverTokens(pair, client, res);
  }

  @Public()
  @Post('logout')
  @HttpCode(204)
  async logout(
    @Body() dto: RefreshDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const token = dto.refreshToken ?? (req.cookies?.[REFRESH_COOKIE] as string | undefined);
    if (token) await this.tokens.revoke(token);
    res.clearCookie(REFRESH_COOKIE, this.cookieOptions());
  }

  @ApiBearerAuth()
  @Get('me')
  @ApiOkResponse({ type: MeDto })
  me(@CurrentUser() user: AuthUser): Promise<MeDto> {
    return this.auth.me(user.id);
  }

  private deliverTokens(pair: TokenPair, client: string | undefined, res: Response) {
    if (client === 'web') {
      res.cookie(REFRESH_COOKIE, pair.refreshToken, {
        ...this.cookieOptions(),
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      return { accessToken: pair.accessToken, expiresIn: pair.expiresIn };
    }
    return pair;
  }

  private cookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      sameSite: 'strict',
      secure: this.config.get('NODE_ENV') === 'production',
      path: `/${API_PREFIX}/auth`,
    };
  }
}
