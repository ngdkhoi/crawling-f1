import { Module } from '@nestjs/common';
import { CrawlModule } from './crawl/crawl.module';
import {ConfigModule}  from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    CrawlModule
  ],
})
export class AppModule {}
