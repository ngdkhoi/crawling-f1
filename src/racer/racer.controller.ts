import { Body, Controller, Get, Query } from '@nestjs/common';
import { RacerService } from './racer.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('racer')
@ApiTags('racer')
export class RacerController {
  constructor(private racerService: RacerService){}

  @Get('search-racer')
  @ApiQuery({name: 'racerName', required: false})
  @ApiQuery({name: 'teamName', required: false})
  async searchRacer(@Query() racerInfo) {
    return await this.racerService.findRacer(racerInfo)
  }
}
