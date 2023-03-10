import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/*
| 1 Fiji Water      | 14 points |
| 1 Campbell Soup   | 12 points |
| 1 First Aid Pouch | 10 points |
| 1 AK47            |  8 points  |
*/

async function main() {
  const data = [
    {
      name: 'Fiji Water ',
      points: 14,
    },
    {
      name: 'Campbell Soup ',
      points: 12,
    },
    {
      name: 'First Aid Pouch',
      points: 10,
    },
    {
      name: 'AK47 ',
      points: 8,
    },
  ];

  await Promise.all(
    data.map(async (item) => {
      const existingItem = await prisma.item.findFirst({
        where: {
          name: item.name,
        },
      });

      if (!existingItem) {
        await prisma.item.create({
          data: item,
        });
      }
    }),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
