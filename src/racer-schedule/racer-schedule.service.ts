import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RacerScheduleService {
  constructor(private prisma: PrismaService){}
  async createRacerSchedules(listRacerSchedule, year, placeId) {
    try {
      let  season = await this.prisma.seasons.findFirst({where:{year: year}})
      if (season == null) {
        season = await this.prisma.seasons.create({
          data: {
            year: year
          }
        })
      }
      const addRacerSchedules = listRacerSchedule.forEach(async racerSchedule => {
        const racer = await this.prisma.racers.findFirst({
          where: {
            AND: [
              {
                id: {
                  in: season.racerId
                }
              },
              {
                name: racerSchedule.name
              }
            ]
          }
        })
        const schedule = await this.prisma.schedules.findFirst({
          where: {
            placeId: placeId
          }
        })
        if (racer != null && schedule != null) {
          console.log(racer.id);
          console.log(schedule.id);
          
          await this.prisma.racerSchedules.create({
            data:{
              racerId: racer.id,
              scheduleId: schedule.id,
              pts: racerSchedule.pts,
              completeTime: racerSchedule.timeRace || null
            }
          })
        }
        
      })

      await Promise.all(addRacerSchedules)
    } catch (error) {
      console.log(error);
      
    }
  }
}
