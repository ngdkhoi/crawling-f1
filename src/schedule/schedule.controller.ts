import { Get, Controller } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('schedule')
@ApiTags('Schedule')
export class ScheduleController {
  @Get('create-schedules')
  @ApiQuery({name: 'year', required: true, description: 'Year of schedules want to crawl'})
  async createSchedule () {
    
  }
}
