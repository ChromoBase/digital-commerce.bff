import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './modules/health/health.module';
import { StorefrontModule } from './modules/storefront/storefront.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    HealthModule,
    StorefrontModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
