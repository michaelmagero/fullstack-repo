import * as bcrypt from 'bcrypt';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const roundsOfHashing = 10;

async function main() {
  const adminpassword = await bcrypt.hash('cmsadmin@_23', roundsOfHashing);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@cms.com' },
    update: {},
    create: {
      firstname: 'michael',
      lastname: 'magero',
      email: 'admin@cms.com',
      phone: '0711223344',
      password: adminpassword,
      status: true,
      role: 'admin',
    },
  });
  console.log({ admin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
