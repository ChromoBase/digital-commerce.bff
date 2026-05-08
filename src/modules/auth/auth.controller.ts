import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../../common/types/authenticated-user.type';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @Throttle({ short: { limit: 3, ttl: 60000 } }) // 3 per minute
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.register(dto);

    this.setAuthCookies(response, result.accessToken, result.refreshToken);

    return result;
  }

  @Post('login')
  @Throttle({ short: { limit: 5, ttl: 60000 } }) // 5 per minute
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(dto);

    this.setAuthCookies(response, result.accessToken, result.refreshToken);

    return result;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getMe(@CurrentUser() user: AuthenticatedUser) {
    const fullUser = await this.usersService.findById(user.id);
    if (!fullUser) {
      return null;
    }
    return this.usersService.toPublicUser(fullUser);
  }

  @Post('refresh')
  @Throttle({ short: { limit: 10, ttl: 60000 } }) // 10 per minute
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() dto: RefreshTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.refreshTokens(dto.refreshToken);

    this.setAuthCookies(response, tokens.accessToken, tokens.refreshToken);

    return tokens;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Body() dto: RefreshTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.logout(dto.refreshToken);

    this.clearAuthCookies(response);

    return result;
  }

  private setAuthCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    const isProduction = process.env.NODE_ENV === 'production';

    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
      path: '/',
    });

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      path: '/',
    });
  }

  private clearAuthCookies(response: Response): void {
    response.clearCookie('accessToken', { path: '/' });
    response.clearCookie('refreshToken', { path: '/' });
  }
}
