import { Controller, Get } from '@nestjs/common';
import { CrawlService } from './crawl.service';
import { ApiTags } from '@nestjs/swagger';
import { RacerService } from 'src/racer/racer.service';
import { TeamService } from 'src/team/team.service';

@Controller('crawl')
@ApiTags("Crawl")
export class CrawlController {
  constructor(
    private teamService: TeamService,
    private crawlService: CrawlService,
    private racerService: RacerService
  ) {}
  @Get('/racers')
  async getRacer() {
    const racersData = await this.crawlService.crawlRacerData()

    // await this.racerService.createRacers(racersData.data)

    return racersData
  }

  @Get('/teams')
  async getTeam() {
    const teamsData = await this.crawlService.crawlTeamData()

    await this.teamService.createTeams(teamsData.data)
    return teamsData
  }

  @Get('/racer-schedule')
  async getRacerSchedule() {
    return await this.crawlService.crawlRacerScheduleData()
  }
}
