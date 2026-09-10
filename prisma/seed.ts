import { PrismaClient } from "@prisma/client";
import { PEOPLE } from "../lib/config";

const prisma = new PrismaClient();

async function main() {
  for (const p of PEOPLE) {
    await prisma.person.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        title: p.title,
        department: p.department,
        order: p.order,
      },
      create: {
        slug: p.slug,
        name: p.name,
        title: p.title,
        department: p.department,
        order: p.order,
      },
    });
  }
  console.log(`Seeded ${PEOPLE.length} people.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
