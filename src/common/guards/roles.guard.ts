import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthenticatedUser } from '../types/authenticated-user.type';

/**
 * RolesGuard - Validates that an authenticated user has required roles.
 *
 * Usage: Apply @Roles() decorator to routes, then @UseGuards(AuthGuard, RolesGuard)
 *
 * This guard checks:
 * 1. User role (CUSTOMER, SUPER_ADMIN)
 * 2. Store-specific role (STORE_ADMIN via memberships)
 *
 * TODO: Add UsersService injection to check store memberships for STORE_ADMIN
 *
 * Current state: Validates against user.role and user.storeRole
 * Requires AuthGuard to populate request.user first
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      // No roles required, allow access
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthenticatedUser }>();
    const user = request.user;

    if (!user) {
      // User not authenticated, deny access
      // AuthGuard should have caught this, but double-check
      return false;
    }

    // Check if user has any of the required roles
    return requiredRoles.some((role) => {
      // Check platform-level role
      if (user.role === role) {
        return true;
      }

      // Check store-specific role
      if (user.storeRole === role) {
        return true;
      }

      return false;
    });
  }
}
