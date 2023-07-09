import { Global, Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

@Global()
@Module({
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService]
})
export class TeamModule {}
