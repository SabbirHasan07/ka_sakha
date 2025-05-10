'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DonatePage() {
  const [name, setName] = useState('');
  const [bkash, setBkash] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/donor', {
      method: 'POST',
      body: JSON.stringify({ name, bkash }),
    });

    if (res.ok) {
      router.push('/');
    } else {
      alert('কিছু ভুল হয়েছে, আবার চেষ্টা করুন');
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">🫱 অনুদান করুন</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">আপনার নাম</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="নাম লিখুন"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">বিকাশ নাম্বার</label>
            <input
              type="text"
              value={bkash}
              onChange={(e) => setBkash(e.target.value)}
              placeholder="বিকাশ নাম্বার দিন"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            disabled={loading}
          >
            {loading ? 'পাঠানো হচ্ছে...' : 'সাবমিট করুন'}
          </button>
        </form>
      </div>
    </main>
  );
}
