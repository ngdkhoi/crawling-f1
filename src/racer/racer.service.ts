import { Injectable } from '@nestjs/common';
import { RacerDto } from 'src/racer/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RacerService {
  constructor(private prisma: PrismaService) {}
  async createRacers(listRacers) {
    console.log('in here');
    console.log(listRacers[0]);
    try {
      const addRacers = listRacers.forEach(async (racer) => {
        const data = await this.prisma.racers.create({
          data: {
            name: racer.name,
            href: racer.href,
          }
        })

        console.log(data);
        
      })
      await Promise.all(addRacers)
    } catch (error) {
      console.log(error);
      
    }
  }
}
