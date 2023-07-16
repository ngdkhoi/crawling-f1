export interface TeamSerializer{
  id?: number
  name: string
  logoImageUrl: string
  createdAt: Date
  updatedAt: Date
  racers: Array<object>
}

export interface TeamSerializer extends Array<TeamSerializer> { }