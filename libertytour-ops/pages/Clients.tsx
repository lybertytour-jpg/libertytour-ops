import React from 'react';
import { Mail, Phone, Building, User } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Clients: React.FC = () => {
  const { clients, loading } = useData();

  if (loading && clients.length === 0) return <div className="p-8 text-center text-gray-500">Loading clients...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-slate-900">Clients</h2>
            <p className="text-sm text-slate-500">B2B Partners and Direct Customers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map(client => (
          <div key={client.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
             <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${client.type === 'B2B' ? 'bg-indigo-600' : 'bg-emerald-500'}`}>
                        {client.type === 'B2B' ? <Building className="w-5 h-5"/> : <User className="w-5 h-5"/>}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">{client.name}</h3>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{client.type}</span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">{client.totalOrders}</p>
                    <p className="text-xs text-gray-500">Orders</p>
                </div>
             </div>
             
             <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400"/>
                    <span>{client.email}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400"/>
                    <span>{client.phone}</span>
                </div>
             </div>

             <div className="mt-6 pt-4 border-t border-gray-100 flex gap-2">
                <button className="flex-1 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-slate-700 font-medium">History</button>
                <button className="flex-1 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Edit</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clients;