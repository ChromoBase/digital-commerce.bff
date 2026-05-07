import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedUser } from '../types/authenticated-user.type';

/**
 * Decorator to extract the authenticated user from the request.
 * Usage: @CurrentUser() user: AuthenticatedUser
 *
 * Note: Requires AuthGuard to be applied to the route.
 * Returns undefined if no user is authenticated.
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthenticatedUser | undefined => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user?: AuthenticatedUser }>();
    return request.user;
  },
);
