import { PublicUser } from '../../users/types/public-user.type';

export interface AuthResponse {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string; // user.id
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
