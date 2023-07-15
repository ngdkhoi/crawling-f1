import { Injectable } from '@nestjs/common';
import { racerFilter, scheduleFilter } from 'src/helper/filter.helper';
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
      const addRacerSchedules = listRacerSchedule.map(async racerSchedule => {
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

  async findRacerSchedule(round, year) {
    try {
      const result = this.prisma.racerSchedules.findMany({
        where: {
              schedule: {
                round,
                season: {
                  year
                }
              }
            },
        select: {
          racer: {
            select: {
              name: true
            }
          },
          pts: true,
          id: true,
          completeTime:true
        }
      })

      return result
    } catch (error) {
      
    }
  }

  async filterRacer(dto) {
    try {
      const schedule = scheduleFilter({round: dto.round, year: dto.year})  
      const racer = racerFilter({teamName: dto.teamName})

      const result = await this.prisma.racerSchedules.groupBy({
        by: ['racerId'],
        _sum: {
          pts: true,
          completeTime: true
        },
        orderBy: {
          _sum: {
            pts: dto.sortPts,
          }
        },
        having: {
          pts: {
            _sum:{
              lte: dto.maxPts,
              gte: dto.minPts
            }
          }
        },
        where: {
          schedule,
          racer
        }
        
      })

      return result
    } catch (error) {
      console.log(error);
      
    }
  }

  filterGroupBy(): object {
    let groupBy = {}

    return groupBy
  }

  orderBy(order, sortValue) {
    return {
      _sum: {
        [sortValue]: order
      }
    }
  }

  roundFilter(round = -1, sortPts = 'asc', ptsMin = 0, ptsMax = 0) {

  }

  nameFilter(nameContain) {
    return {
      name: {
        contains: nameContain
      }
    }
  }

  ptsFilter(ptsRange) {
    const condition = ptsRange.map( ele => {
      
    })
    return {
      racerSchedules: {
        OR: [
          {

          }
        ]
      }
    }
  }

  teamFi

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
