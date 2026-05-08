import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { FaqsService } from './faqs.service';

@Controller('faqs')
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.faqsService.findAllActive();
  }
}
