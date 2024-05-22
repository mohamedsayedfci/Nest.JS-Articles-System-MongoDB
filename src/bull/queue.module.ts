// src/bull/bull.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { BullService } from './bull.service';
import { BullController } from './bull.controller';
import { ExampleProcessor } from './example.processor';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'exampleQueue',
    }),
  ],
  providers: [BullService, ExampleProcessor],
  controllers: [BullController],
})
export class QueueModule {}
