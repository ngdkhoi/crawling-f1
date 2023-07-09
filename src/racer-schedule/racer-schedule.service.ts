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
        const isExist = await this.isExist(racer?.id, schedule?.id)
        if (racer != null && schedule != null && !isExist) {
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

  private async isExist(racerId, scheduleId) {
    try {
      const racerSchedule = await this.prisma.racerSchedules.findFirst({
        where: {
          racerId,
          scheduleId
        }
      })
      console.log(racerSchedule);
      
      return !racerSchedule ? false :true
    } catch (error) {
      
    }
  }
}
