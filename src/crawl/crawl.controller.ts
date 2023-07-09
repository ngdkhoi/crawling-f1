import { Controller, Get, Query } from '@nestjs/common';
import { CrawlService } from './crawl.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { RacerService } from 'src/racer/racer.service';
import { TeamService } from 'src/team/team.service';
import { ScheduleService } from 'src/schedule/schedule.service';
import { RacerScheduleService } from 'src/racer-schedule/racer-schedule.service';

@Controller('crawl')
@ApiTags("Crawl")
export class CrawlController {
  constructor(
    private teamService: TeamService,
    private crawlService: CrawlService,
    private racerService: RacerService,
    private scheduleService: ScheduleService,
    private racerScheduleService: RacerScheduleService
  ) {}
  @Get('/crawl-racers')
  async getRacer() {
    const racersData = await this.crawlService.crawlRacerData()

    await this.racerService.createRacers(racersData.data)

    return racersData
  }

  @Get('/crawl-teams')
  async getTeam() {
    const teamsData = await this.crawlService.crawlTeamData()

    await this.teamService.createTeams(teamsData.data)
    return teamsData
  }

  @Get('/crawl-schedules')
  @ApiQuery({name: 'year', required: true, type: Number})
  async getSchedule(@Query() req) {
    const schedulesList = await this.crawlService.crawlScheduleData(req.year)
    await this.scheduleService.createSchedules(parseInt(req.year), schedulesList.data)
    return schedulesList
  }

  @Get('/crawl-racer-schedules')
  @ApiQuery({name: 'year', required: true, type: Number})
  @ApiQuery({name: 'placeId', required: true, type: Number})
  async getRacerSchedule(@Query() req) {
    const racerSchedules = await this.crawlService.crawlRacerScheduleData(parseInt(req.year), parseInt(req.placeId))
    console.log(racerSchedules);
    
    await this.racerScheduleService.createRacerSchedules(racerSchedules.schedules, parseInt(req.year), parseInt(req.placeId))
    return racerSchedules
  }
}
