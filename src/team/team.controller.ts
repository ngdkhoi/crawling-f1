import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { TeamService } from './team.service';
import { TeamSerializer } from './dto';

@Controller('team')
@ApiTags('Teams')
export class TeamController {
  constructor(private teamService: TeamService){}

  @Get('search-team')
  @ApiQuery({name: 'teamName', required: false})
  @ApiQuery({name: 'raceName', required: false})
  async searchTeam(@Query() req){
    return this.teamService.searchTeam(req);
  }
}
