import { Injectable } from '@nestjs/common';
import { RacerDto } from 'src/racer/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RacerService {
  constructor(private prisma: PrismaService) {}
  async createRacers(listRacers) {
    try {
      const addRacers = listRacers.forEach(async (racer) => {
        const team = await this.prisma.teams.findFirst({where: {
          name: racer.team
        }})
        await this.prisma.racers.create({
          data: {
            name: racer.name,
            href: racer.href,
            teamId: team.id || 1
          }
        })

      })
      await Promise.all(addRacers)
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
}
