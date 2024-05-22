// src/bull/example.processor.ts
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('exampleQueue')
export class ExampleProcessor {
  @Process()
  async handleJob(job: Job<any>) {
    console.log('Processing job:', job.data);
    return ''
    // Add your job processing logic here
  }
}
