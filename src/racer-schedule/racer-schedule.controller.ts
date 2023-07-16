import { Body, Controller, Get, Query } from '@nestjs/common';
import { RacerScheduleService } from './racer-schedule.service';
import { ApiQuery } from '@nestjs/swagger';
import { RacerScheduleDto } from './dto';

@Controller('racer-schedule')
export class RacerScheduleController {
  constructor(private racerScheduleService: RacerScheduleService) {}

  @Get('search-racer-schedule')
  @ApiQuery({name: 'year', required: true})
  @ApiQuery({name: 'round', required: true})
  async findRacerSchedule(@Query() req) {
    return this.racerScheduleService.findRacerSchedule(parseInt(req.round), parseInt(req.year))
  }

  @Get('filter-racer')
  @ApiQuery({name: 'year', required: false, type: Number})
  @ApiQuery({name: 'round', required: false, type: Number})
  @ApiQuery({name: 'teamName', required: false, type: String})
  @ApiQuery({name: 'racerName', required: false, type: String})
  @ApiQuery({name: 'sortPts', required: false, type: String})
  @ApiQuery({name: 'maxPts', required: false, type: Number})
  @ApiQuery({name: 'minPts', required: false, type: Number})
  async filterRacer(@Query() dto: RacerScheduleDto) {
    return await this.racerScheduleService.filterRacer(dto)
  }
}
