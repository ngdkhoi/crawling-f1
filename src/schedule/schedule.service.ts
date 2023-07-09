import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async createSchedules(year: number, schedules) {
    try {
      let  season = await this.prisma.seasons.findFirst({where:{year: year}})
      
      if (season == null) {
        season = await this.prisma.seasons.create({
          data: {
            year: year
          }
        })
      }
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
      const splitMonth = (ele) => {
        const res = ele.split('-')
        return res.length == 1 ? [res[0], res[0]] : [res[0], res[1]]
      }
      
      const addSchedule = schedules.forEach(async ele => {
        const month = splitMonth(ele.month)
        const schedule = await this.prisma.schedules.findFirst({
          where: {
            seasonId: season.id,
            round: ele.round
          }
        })
        if (!schedule) {
          await this.prisma.schedules.create({
            data: {
              startAt: new Date(year, months.indexOf(month[0]), ele.startDate),
              endAt: new Date(year, months.indexOf(month[1]), ele.endDate),
              place: ele.place,
              round: ele.round,
              seasonId: season.id,
              placeId: ele.placeId
            }
          })
        }
        
      })
      await Promise.all(addSchedule)
    } catch (error) {
      console.log(error);
      
    }
  }
}
