import { Module } from '@nestjs/common';
import { CrawlModule } from './crawl/crawl.module';
import { RacerModule } from './racer/racer.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { TeamController } from './team/team.controller';
import { TeamService } from './team/team.service';
import { TeamModule } from './team/team.module';
import { RacerScheduleService } from './racer-schedule/racer-schedule.service';
import { RacerScheduleController } from './racer-schedule/racer-schedule.controller';
import { RacerScheduleModule } from './racer-schedule/racer-schedule.module';
import {ConfigModule}  from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    CrawlModule,
    RacerModule,
    PrismaModule,
    TeamModule,
    RacerScheduleModule
  ],
  providers: [PrismaService, TeamService, RacerScheduleService],
  controllers: [TeamController, RacerScheduleController],
})
export class AppModule {}
