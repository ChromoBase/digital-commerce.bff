import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { AdminFaqsService } from './admin-faqs.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { ReorderFaqsDto } from './dto/reorder-faqs.dto';

@Controller('admin/faqs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminFaqsController {
  constructor(private readonly adminFaqsService: AdminFaqsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.adminFaqsService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateFaqDto) {
    return this.adminFaqsService.create(dto);
  }

  @Patch('reorder')
  @HttpCode(HttpStatus.OK)
  async reorder(@Body() dto: ReorderFaqsDto) {
    return this.adminFaqsService.reorder(dto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return this.adminFaqsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateFaqDto) {
    return this.adminFaqsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.adminFaqsService.remove(id);
  }

  @Patch(':id/activate')
  @HttpCode(HttpStatus.OK)
  async activate(@Param('id') id: string) {
    return this.adminFaqsService.activate(id);
  }

  @Patch(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  async deactivate(@Param('id') id: string) {
    return this.adminFaqsService.deactivate(id);
  }
}
