import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(request) {
  const body = await request.json();
  const { name, bkash } = body;

  await prisma.donor.create({
    data: {
      name,
      bkash,
      status: 'PENDING'
    }
  });

  return new Response(JSON.stringify({ message: "Donation submitted!" }), {
    status: 200
  });
}
