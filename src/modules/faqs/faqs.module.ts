import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { FaqsController } from './faqs.controller';
import { FaqsService } from './faqs.service';

@Module({
  imports: [DatabaseModule],
  controllers: [FaqsController],
  providers: [FaqsService],
})
export class FaqsModule {}
