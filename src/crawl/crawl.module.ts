import { Module } from '@nestjs/common';
import { CrawlController } from './crawl.controller';
import { CrawlService } from './crawl.service';

@Module({
  imports: [],
  controllers: [CrawlController],
  providers: [CrawlService]
})
export class CrawlModule {}
