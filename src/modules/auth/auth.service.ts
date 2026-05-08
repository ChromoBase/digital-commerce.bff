import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { createHmac, randomBytes } from 'crypto';
import { PrismaService } from '../../database/prisma.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  AuthResponse,
  JwtPayload,
  TokenPair,
} from './types/auth-response.type';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException(
        'Unable to create account with these credentials',
      );
    }

    const user = await this.usersService.createCustomer({
      email: dto.email,
      password: dto.password,
      name: dto.name,
    });

    const tokens = await this.generateTokens(user);

    return {
      user: this.usersService.toPublicUser(user),
      ...tokens,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await this.verifyPassword(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);

    return {
      user: this.usersService.toPublicUser(user),
      ...tokens,
    };
  }

  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    try {
      const tokenHash = this.hashRefreshToken(refreshToken);

      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { tokenHash },
        include: { user: true },
      });

      if (!storedToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (storedToken.revokedAt) {
        throw new UnauthorizedException('Refresh token has been revoked');
      }

      if (new Date() > storedToken.expiresAt) {
        throw new UnauthorizedException('Refresh token has expired');
      }

      await this.revokeRefreshToken(refreshToken);

      const tokens = await this.generateTokens(storedToken.user);

      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string): Promise<{ success: boolean }> {
    try {
      await this.revokeRefreshToken(refreshToken);
    } catch (error) {
      this.logger.warn(
        `Failed to revoke refresh token during logout: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }

    return { success: true };
  }

  async generateTokens(
    user: User,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<TokenPair> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.getOrThrow('JWT_ACCESS_EXPIRES_IN'),
    });

    const refreshToken = randomBytes(32).toString('hex');
    const refreshTokenHash = this.hashRefreshToken(refreshToken);

    const expiresIn = this.configService.getOrThrow<string>(
      'JWT_REFRESH_EXPIRES_IN',
    );
    const expiresAt = this.calculateExpiration(expiresIn);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: refreshTokenHash,
        expiresAt,
        userAgent,
        ipAddress,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      return await argon2.verify(hashedPassword, plainPassword);
    } catch {
      return false;
    }
  }

  hashRefreshToken(token: string): string {
    const secret = this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');
    return createHmac('sha256', secret).update(token).digest('hex');
  }

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    const tokenHash = this.hashRefreshToken(refreshToken);

    await this.prisma.refreshToken.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  private calculateExpiration(duration: string): Date {
    const now = new Date();
    const match = duration.match(/^(\d+)([smhd])$/);

    if (!match) {
      throw new Error(`Invalid duration format: ${duration}`);
    }

    const [, value, unit] = match;
    const numValue = parseInt(value, 10);

    switch (unit) {
      case 's':
        return new Date(now.getTime() + numValue * 1000);
      case 'm':
        return new Date(now.getTime() + numValue * 60 * 1000);
      case 'h':
        return new Date(now.getTime() + numValue * 60 * 60 * 1000);
      case 'd':
        return new Date(now.getTime() + numValue * 24 * 60 * 60 * 1000);
      default:
        throw new Error(`Invalid duration unit: ${unit}`);
    }
  }
}
