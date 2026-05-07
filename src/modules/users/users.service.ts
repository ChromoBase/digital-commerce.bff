import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        memberships: {
          include: {
            store: true,
          },
        },
      },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        memberships: {
          include: {
            store: true,
          },
        },
      },
    });
  }

  getUserMemberships(userId: string) {
    return this.prisma.storeMembership.findMany({
      where: { userId },
      include: {
        store: true,
      },
    });
  }
}
