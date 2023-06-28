import { Global, Module } from '@nestjs/common';
import { RacerController } from './racer.controller';
import { RacerService } from './racer.service';

@Global()
@Module({
  controllers: [RacerController],
  providers: [RacerService],
  exports: [RacerService]
})
export class RacerModule {}
