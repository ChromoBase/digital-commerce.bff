import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from '../../database/prisma.service';
import { CreateCustomerInput, PublicUser } from './types/public-user.type';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async createCustomer(input: CreateCustomerInput): Promise<User> {
    const passwordHash = await argon2.hash(input.password);

    return this.prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        passwordHash,
        role: 'CUSTOMER',
      },
    });
  }

  toPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
