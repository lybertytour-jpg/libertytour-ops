import React from 'react';
import { Car, Phone, MapPin, CircleDot } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Executors: React.FC = () => {
  const { executors, loading } = useData();

  if (loading && executors.length === 0) return <div className="p-8 text-center text-gray-500">Loading executors...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-slate-900">Executors</h2>
            <p className="text-sm text-slate-500">Drivers and fleet status.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                    <th className="px-6 py-4 font-semibold text-slate-600 uppercase text-xs tracking-wider">Name</th>
                    <th className="px-6 py-4 font-semibold text-slate-600 uppercase text-xs tracking-wider">Status</th>
                    <th className="px-6 py-4 font-semibold text-slate-600 uppercase text-xs tracking-wider">Vehicle</th>
                    <th className="px-6 py-4 font-semibold text-slate-600 uppercase text-xs tracking-wider">Contact</th>
                    <th className="px-6 py-4 font-semibold text-slate-600 uppercase text-xs tracking-wider text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {executors.map(driver => (
                    <tr key={driver.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                                    {driver.name.charAt(0)}
                                </div>
                                <span className="font-medium text-slate-900">{driver.name}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                                <CircleDot className={`w-3 h-3 ${driver.status === 'ACTIVE' ? 'text-green-500' : driver.status === 'BUSY' ? 'text-amber-500' : 'text-gray-400'}`} />
                                <span className="text-slate-700">{driver.status}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                            <div className="flex items-center gap-2">
                                <Car className="w-4 h-4 text-gray-400"/>
                                {driver.vehicle}
                            </div>
                        </td>
                         <td className="px-6 py-4 text-slate-600">
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400"/>
                                {driver.phone}
                            </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                             <button className="text-blue-600 hover:text-blue-800 font-medium">View Schedule</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default Executors;