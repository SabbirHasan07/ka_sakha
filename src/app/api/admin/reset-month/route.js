// app/api/admin/reset-month/route.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST() {
  try {
    // Reset monthlyAmount in stats
    await prisma.stats.update({
      where: { id: 'main' },
      data: { monthlyAmount: 0 },
    });

    // Delete all donor records
    await prisma.donor.deleteMany();

    return new Response(JSON.stringify({ message: 'Reset complete' }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
