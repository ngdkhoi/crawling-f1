import { Global, Module } from '@nestjs/common';
import { RacerScheduleController } from './racer-schedule.controller';
import { RacerScheduleService } from './racer-schedule.service';

@Global()
@Module({
  providers: [RacerScheduleService],
  controllers: [RacerScheduleController],
  exports: [RacerScheduleService]
})
export class RacerScheduleModule {}
