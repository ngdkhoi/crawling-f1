import { Module } from '@nestjs/common';
import { CrawlModule } from './crawl/crawl.module';
import { RacerModule } from './racer/racer.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import {ConfigModule}  from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    CrawlModule,
    RacerModule,
    PrismaModule
  ],
  providers: [PrismaService],
})
export class AppModule {}
