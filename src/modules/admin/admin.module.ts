import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { AdminStorefrontController } from './storefront/admin-storefront.controller';
import { AdminStorefrontService } from './storefront/admin-storefront.service';
import { AdminCategoriesController } from './categories/admin-categories.controller';
import { AdminCategoriesService } from './categories/admin-categories.service';
import { AdminProductsController } from './products/admin-products.controller';
import { AdminProductsService } from './products/admin-products.service';
import { AdminFaqsController } from './faqs/admin-faqs.controller';
import { AdminFaqsService } from './faqs/admin-faqs.service';
import { AdminVariantsController } from './variants/admin-variants.controller';
import { AdminVariantsService } from './variants/admin-variants.service';

@Module({
  imports: [DatabaseModule],
  controllers: [
    AdminStorefrontController,
    AdminCategoriesController,
    AdminProductsController,
    AdminFaqsController,
    AdminVariantsController,
  ],
  providers: [
    AdminStorefrontService,
    AdminCategoriesService,
    AdminProductsService,
    AdminFaqsService,
    AdminVariantsService,
  ],
})
export class AdminModule {}
