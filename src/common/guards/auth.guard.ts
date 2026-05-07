import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthenticatedUser } from '../types/authenticated-user.type';

/**
 * AuthGuard - Validates that a request contains a valid authenticated user.
 *
 * TODO: Implement real authentication validation
 * - Validate JWT token from Authorization header
 * - Or validate session cookie
 * - Decode token and extract user info
 * - Attach user to request.user
 *
 * Current state: Placeholder guard structure
 * This guard is ready for production implementation but does not enforce
 * authentication yet. Apply @UseGuards(AuthGuard) to protected routes.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthenticatedUser }>();

    // TODO: Add real authentication logic here
    // Example flow:
    // 1. Extract token from request.headers.authorization
    // 2. Validate token (JWT verification, session lookup, etc.)
    // 3. Extract user data from valid token
    // 4. Attach user to request: request.user = authenticatedUser
    // 5. Return true if authenticated, throw UnauthorizedException if not

    // For now, this guard allows all requests through
    // Remove this return statement when implementing real auth
    return true;

    // Uncomment when ready to enforce authentication:
    // if (!request.user) {
    //   throw new UnauthorizedException('Authentication required');
    // }
    // return true;
  }
}
