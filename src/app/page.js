import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function HomePage() {
  const stats = await prisma.stats.findUnique({ where: { id: 'main' } });
  const donors = await prisma.donor.findMany({
    orderBy: { createdAt: 'desc' },
    take: 60, // up to 60 donors
  });

  return (
    <main className="p-4 sm:p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-blue-800">
        🎉 আমাদের অনুদান প্ল্যাটফর্মে স্বাগতম
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-10 mt-24">
        <div className="bg-white shadow-lg rounded-xl p-5 border-l-4 border-green-500">
          <p className="text-gray-700 text-lg mb-1">মোট অনুদান</p>
          <p className="text-2xl font-bold text-green-700">৳{stats.totalAmount}</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-5 border-l-4 border-blue-500">
          <p className="text-gray-700 text-lg mb-1">এই মাসের অনুদান</p>
          <p className="text-2xl font-bold text-blue-700">৳{stats.monthlyAmount}</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">🧾সব দাতা</h2>

      <div className="bg-white shadow rounded-lg overflow-y-auto max-h-[500px] sm:max-h-[600px] mb-6">
        <ul className="divide-y divide-gray-200">
          {donors.map((donor) => (
            <li
              key={donor.id}
              className="flex justify-between items-center px-4 py-3 hover:bg-gray-50 transition"
            >
              <span className="font-medium text-gray-800 truncate w-2/3 sm:w-auto">{donor.name}</span>
              <span
                className={`text-sm px-3 py-1 rounded-full font-semibold ${
                  donor.status === 'PAID'
                    ? 'bg-green-200 text-green-800'
                    : 'bg-yellow-200 text-yellow-800'
                }`}
              >
                {donor.status === 'PAID' ? 'পরিশোধিত' : 'অপেক্ষমাণ'}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <a
        href="/donate"
        className="block text-center bg-blue-600 text-white text-lg py-3 px-6 rounded-xl hover:bg-blue-700 transition duration-200 shadow-md"
      >
        এখনই অনুদান দিন
      </a>
    </main>
  );
}
