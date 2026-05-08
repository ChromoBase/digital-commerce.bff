import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { StorefrontService } from './storefront.service';
import { PrismaService } from '../../database/prisma.service';

describe('StorefrontService', () => {
  let service: StorefrontService;

  const mockPrismaService = {
    store: {
      findUnique: jest.fn(),
    },
  };

  const mockConfigService = {
    getOrThrow: jest.fn().mockReturnValue('digicams'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorefrontService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<StorefrontService>(StorefrontService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
