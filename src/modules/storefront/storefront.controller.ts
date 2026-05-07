import { Controller, Get } from '@nestjs/common';
import { StorefrontService } from './storefront.service';

@Controller('storefront')
export class StorefrontController {
  constructor(private readonly storefrontService: StorefrontService) {}

  @Get('home')
  getHome() {
    return this.storefrontService.getHome();
  }
}
