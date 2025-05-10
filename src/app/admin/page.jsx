'use client';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
    const [donors, setDonors] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [monthlyAmount, setMonthlyAmount] = useState(0);
    const [amountInputs, setAmountInputs] = useState({}); // For tracking entered amounts
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDonors();
        fetchStats();
    }, []);

    async function fetchDonors() {
        const res = await fetch('/api/admin/donors');
        const data = await res.json();
        setDonors(data);
    }

    async function fetchStats() {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        setTotalAmount(data.totalAmount || 0);
        setMonthlyAmount(data.monthlyAmount || 0);
    }

    async function approveDonor(id) {
        const amount = amountInputs[id];
        if (!amount || isNaN(amount)) return alert('Enter a valid amount');

        setLoading(true);
        await fetch(`/api/admin/donors`, {
            method: 'PATCH',
            body: JSON.stringify({ id, status: 'PAID', amount }),
        });

        await fetch(`/api/admin/stats`, {
            method: 'PATCH',
            body: JSON.stringify({
                totalAmount: totalAmount + Number(amount),
                monthlyAmount: monthlyAmount + Number(amount),
            }),
        });

        await fetchDonors();
        await fetchStats();
        setLoading(false);
    }

    async function updateStats(field, value) {
        await fetch(`/api/admin/stats`, {
            method: 'PATCH',
            body: JSON.stringify({ [field]: Number(value) }),
        });
        fetchStats();
    }

    async function clearMonthly() {
  const confirmed = window.confirm("আপনি কি নিশ্চিত মাসিক তথ্য মুছতে চান?");
  if (!confirmed) return;

  const res = await fetch('/api/admin/reset-month', { method: 'POST' });

  if (res.ok) {
    // Immediately update UI state
    setMonthlyAmount(0);
    setDonors([]);
    alert('মাসিক তথ্য সফলভাবে মুছে ফেলা হয়েছে।');
  } else {
    alert('মুছে ফেলতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
  }
}


    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">🎛 Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-white rounded-xl p-5 shadow">
                    <label className="font-semibold">Total Amount</label>
                    <input
                        type="number"
                        value={totalAmount}
                        onChange={(e) => setTotalAmount(e.target.value)}
                        className="border mt-1 p-2 rounded w-full"
                    />
                    <button
                        className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
                        onClick={() => updateStats('totalAmount', totalAmount)}
                    >
                        Update Total
                    </button>
                </div>

                <div className="bg-white rounded-xl p-5 shadow">
                    <label className="font-semibold">Monthly Amount</label>
                    <input
                        type="number"
                        value={monthlyAmount}
                        onChange={(e) => setMonthlyAmount(e.target.value)}
                        className="border mt-1 p-2 rounded w-full"
                    />
                    <div className="flex gap-2 mt-3">
                        <button
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded"
                            onClick={() => updateStats('monthlyAmount', monthlyAmount)}
                        >
                            Update Monthly
                        </button>
                        <button
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded"
                            onClick={clearMonthly}
                        >
                            Clear Monthly
                        </button>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">🧾 Donor List</h2>
            <div className="space-y-4">
                {donors.length === 0 && (
                    <p className="text-gray-500">No donors found.</p>
                )}
                {donors.map((donor) => (
                    <div
                        key={donor.id}
                        className={`border-l-4 ${donor.status === 'PAID' ? 'border-green-500' : 'border-yellow-400'
                            } bg-white shadow p-4 rounded-xl`}
                    >
                        <p><strong>Name:</strong> {donor.name}</p>
                        <p><strong>Bkash:</strong> {donor.bkash}</p>
                        <p>
                            <strong>Status:</strong>{' '}
                            <span
                                className={`inline-block px-2 py-1 rounded text-sm ${donor.status === 'PAID'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                    }`}
                            >
                                {donor.status}
                            </span>
                        </p>
                        {donor.status !== 'PAID' && (
                            <>
                                <input
                                    type="number"
                                    placeholder="Enter amount"
                                    className="border mt-2 p-2 rounded w-full"
                                    value={amountInputs[donor.id] || ''}
                                    onChange={(e) =>
                                        setAmountInputs({
                                            ...amountInputs,
                                            [donor.id]: e.target.value,
                                        })
                                    }
                                />
                                <button
                                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
                                    onClick={() => approveDonor(donor.id)}
                                    disabled={loading}
                                >
                                    {loading ? 'Approving...' : 'Approve & Update'}
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
