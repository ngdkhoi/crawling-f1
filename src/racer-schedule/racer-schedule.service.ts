import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RacerScheduleService {
  constructor(private prisma: PrismaService){}
  async createRacerSchedule(listRacerSchedule, year) {
    try {
      const addRacerSchedules = listRacerSchedule.forEach(async racerSchedule => {
        const season = await this.prisma.seasons.findFirst({where:{year: year}})
        const racer = await this.prisma.racers.findFirst({
          where: {
            id: {
              in: season.racerId
            }
          }
        })
        const schedule = await this.prisma.schedules.findFirst({
          where: {
            id: {
              in: season.racerId
            }
          }
        })
        const teamDb = await this.prisma.racerSchedules.create({
          data:{
            racerId: racer.id,
            scheduleId: schedule.id
          }
        })
      })

      await Promise.all(addRacerSchedules)
    } catch (error) {
      
    }
  }
}
