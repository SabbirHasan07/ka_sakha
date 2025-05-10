import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.stats.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      totalAmount: 0,
      monthlyAmount: 0
    }
  });
}

main()
  .then(() => console.log('Seeded'))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
