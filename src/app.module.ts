import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './modules/health/health.module';
import { StorefrontModule } from './modules/storefront/storefront.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AdminModule } from './modules/admin/admin.module';
import { FaqsModule } from './modules/faqs/faqs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    AdminModule,
    HealthModule,
    StorefrontModule,
    CategoriesModule,
    ProductsModule,
    FaqsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
