import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RacerDto } from 'src/racer/dto';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService){}
  async createTeams(listTeams) {
    try {
      const addTeams = listTeams.forEach(async team => {
        const teamDb = await this.prisma.teams.create({
          data:{
            name: team.name,
            logoImageUrl: team.logo,
          }
        })

        team.racers.forEach(async racer => {
          await this.updateTeamForRacer(teamDb.id, racer)
        })
      })

      await Promise.all(addTeams)
    } catch (error) {
      
    }
  }

  private async updateTeamForRacer(teamId: number, racerName: string) {
    const team = await this.prisma.teams.findFirst({where: {id: teamId}})
    const racer = await this.prisma.racers.findFirst({where: {name: racerName}})
    if (team == null || racer == null) {
      return false
    }

    await this.prisma.racers.update({
      where: {
        id: racer.id
      },
      data: {
        teamId: team.id
      }
    })

    return true
  }

  async searchTeam(teamInfo) {
    try {
      console.log(teamInfo);
      
      const teams = await this.prisma.teams.findMany({
        where:{
          OR: [
            {
              name: {
                contains: teamInfo?.teamName
              }
            },
            {
              racers: {
                every: {
                  name: {
                    contains: teamInfo?.racerName
                  }
                }
              }
            },
          ]
        },
        select: {
          name: true,
          racers: true
        }
      })

      return teams
    } catch (error) {
      
    }
  }
}
