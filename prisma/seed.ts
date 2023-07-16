import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
//create default team

async function main() {
  const team = await prisma.teams.create({
    data: {
      name: 'null',
      logoImageUrl: 'null'
    }
  })
  console.log(team);
  
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })