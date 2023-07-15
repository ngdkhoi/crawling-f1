import { RacerDto } from "src/racer/dto"
import { ScheduleDto } from "src/schedule/dto"
import { TeamDto } from "src/team/dto"

export const scheduleFilter = (dto: ScheduleDto) => {
  const schedule = {
    season: {
      year: dto.year
    }
  }

  if (dto.round != undefined) {
    schedule['round'] = dto.round
  }

  return schedule
}

export const teamFilter = (dto: TeamDto) => {
  const team = {
    name: {
      contains: dto.name
    }
  }

  return team
}

export const racerFilter = (dto: RacerDto) => {
  const team = teamFilter({name: dto.teamName})
  
  const racer = {
    team
  }

  if (dto.name != null) {
    racer['name']['contains'] = dto.name
  }

  return racer
}
