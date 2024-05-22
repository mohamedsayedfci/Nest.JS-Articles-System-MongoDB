// src/bull/bull.service.ts
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class BullService {
  constructor(@InjectQueue('exampleQueue') private readonly exampleQueue: Queue) {}

  async addJob(data: any) {
    await this.exampleQueue.add(data);
  }
}
