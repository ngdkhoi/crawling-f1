import { Controller, Get } from '@nestjs/common';
import { CrawlService } from './crawl.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('crawl')
@ApiTags("Crawl")
export class CrawlController {
  constructor(private crawlService: CrawlService) {}
  @Get('/racers')
  async getRacer() {
    return this.crawlService.crawlRacerData()
  }

  @Get('/teams')
  async getTeam() {
    return this.crawlService.crawlTeamData()
  }
}
