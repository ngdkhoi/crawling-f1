import { Controller, Get } from '@nestjs/common';
import { CrawlService } from './crawl.service';
import { ApiTags } from '@nestjs/swagger';
import { RacerService } from 'src/racer/racer.service';

@Controller('crawl')
@ApiTags("Crawl")
export class CrawlController {
  constructor(private crawlService: CrawlService, private racerService: RacerService) {}
  @Get('/racers')
  async getRacer() {
    const racersData = await this.crawlService.crawlRacerData()
    console.log('khoi');
    
    const test = await this.racerService.createRacers(racersData.data)
    console.log('done');
    
    return test
  }

  @Get('/teams')
  async getTeam() {
    return this.crawlService.crawlTeamData()
  }
}
