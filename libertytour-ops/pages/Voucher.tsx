import React, { useState } from 'react';
import { Ticket, RefreshCw, Copy, CheckCircle, ExternalLink } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Voucher: React.FC = () => {
  const { orders, regenerateVoucher } = useData();
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  // Filter orders that actually have vouchers (CONFIRMED+)
  const activeVouchers = orders.filter(o => o.voucher && o.status !== 'CANCELLED');

  const handleRegenerate = async (orderId: string) => {
    if (!confirm("Are you sure? This will invalidate the old voucher link immediately.")) return;
    
    setGeneratingId(orderId);
    try {
        await regenerateVoucher(orderId);
    } catch (e) {
        alert("Failed");
    } finally {
        setGeneratingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-slate-900">Voucher Management</h2>
            <p className="text-sm text-slate-500">Manage active access tokens for passengers.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                    <th className="px-6 py-4 font-semibold text-slate-600 uppercase text-xs tracking-wider">Order ID</th>
                    <th className="px-6 py-4 font-semibold text-slate-600 uppercase text-xs tracking-wider">Passenger</th>
                    <th className="px-6 py-4 font-semibold text-slate-600 uppercase text-xs tracking-wider">Token</th>
                    <th className="px-6 py-4 font-semibold text-slate-600 uppercase text-xs tracking-wider">Expires</th>
                    <th className="px-6 py-4 font-semibold text-slate-600 uppercase text-xs tracking-wider text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {activeVouchers.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                        <td className="px-6 py-4">{order.clientName}</td>
                        <td className="px-6 py-4 font-mono text-slate-600 bg-gray-50 rounded w-max px-2">
                            {order.voucher?.token}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                             {order.voucher?.expiresAt.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right flex items-center justify-end gap-3">
                             <a 
                                href={`#`} 
                                onClick={(e) => { e.preventDefault(); alert("Opens public voucher view"); }}
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                             >
                                <ExternalLink className="w-4 h-4"/> Public Link
                             </a>
                             <button 
                                onClick={() => handleRegenerate(order.id)}
                                disabled={generatingId === order.id}
                                className="text-slate-500 hover:text-orange-600 transition disabled:opacity-50"
                                title="Regenerate Token"
                             >
                                <RefreshCw className={`w-4 h-4 ${generatingId === order.id ? 'animate-spin' : ''}`} />
                             </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default Voucher;