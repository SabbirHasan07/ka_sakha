import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  const donors = await prisma.donor.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return new Response(JSON.stringify(donors), { status: 200 });
}

export async function PATCH(req) {
  const { id, status, amount } = await req.json();
  await prisma.donor.update({
    where: { id },
    data: {
      status,
      amount: Number(amount)
    }
  });
  return new Response(JSON.stringify({ message: 'Donor updated' }), { status: 200 });
}
