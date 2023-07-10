import { Injectable } from '@nestjs/common';
import { RacerDto } from 'src/racer/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RacerService {
  constructor(private prisma: PrismaService) {}
  async createRacers(listRacers, year) {
    try {
      let  season = await this.prisma.seasons.findFirst({where:{year: year}})
      if (season == null) {
        season = await this.prisma.seasons.create({
          data: {
            year: year
          }
        })
      }
      const ids = []
      const addRacers = listRacers.forEach(async (racer) => {
        const team = await this.prisma.teams.findFirst({where: {
          name: racer.team
        }}) || {id: 1}
        console.log(team);
        const isExist = await this.isExist(racer.name, racer.team)
        if (!isExist) {
          const newRacer = await this.prisma.racers.create({
            data: {
              name: racer.name,
              href: racer.href,
              teamId: team.id
            }
          })
          ids.push(newRacer)
        }

      })
      await Promise.all(addRacers)
      await this.prisma.seasons.update({
        where: {
          year: year
        },
        data: {
          racerId: ids
        }
      })
    } catch (error) {
      console.log(error);
      
    }
  }

  async findRacer(racerInfo){
    try {
      const racers = await this.prisma.racers.findMany({
        where:{
          OR: [
            {
              name: {
                contains: racerInfo?.racerName
    
              }
            },
            {
              team: {
                name: {
                  contains: racerInfo?.teamName
                }
          },
            }
          ]
          
        }
      })

      return racers
    } catch (error) {
      
    }
  }

  private async isExist(racerName, teamName) {
    try {
      const racer = await this.prisma.racers.findFirst({
        where: {
          AND: [
            {
              name: racerName
            },
            {
              team: {
                name: teamName
              }
            }
          ]
        }
      })
      return racer ? true : false
    } catch (error) {
      
    }
  }
}
