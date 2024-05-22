// src/bull/bull.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { BullService } from './bull.service';

@Controller('bull')
export class BullController {
  constructor(private readonly bullService: BullService) {}

  @Post('add-job')
  async addJob(@Body() data: any) {
    await this.bullService.addJob(data);
    return { message: 'Job added successfully' };
  }
}
