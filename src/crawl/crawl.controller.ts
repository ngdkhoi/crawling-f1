import { Controller, Get } from '@nestjs/common';
import { CrawlService } from './crawl.service';

@Controller('users')
export class CrawlController {
  constructor(private crawlService: CrawlService) {}
  @Get('me')
  async get() {
    // return 'dsa'
    return this.crawlService.crawlData()
  }
}
