import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Decorator to specify which roles are allowed to access a route.
 * Usage: @Roles('SUPER_ADMIN', 'STORE_ADMIN')
 *
 * Note: Requires RolesGuard to be applied to the route.
 * Must be used in combination with AuthGuard.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
