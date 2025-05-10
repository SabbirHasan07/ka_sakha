import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  const stats = await prisma.stats.findUnique({ where: { id: 'main' } });
  return new Response(JSON.stringify(stats), { status: 200 });
}

export async function PATCH(req) {
  const updates = await req.json();
  await prisma.stats.update({
    where: { id: 'main' },
    data: updates
  });
  return new Response(JSON.stringify({ message: 'Stats updated' }), { status: 200 });
}
