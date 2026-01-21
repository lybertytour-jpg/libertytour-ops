import React, { useState } from 'react';
import { Clock, User, ChevronLeft, ChevronRight, X, MapPin } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { useData } from '../contexts/DataContext';

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.COMPLETED: return 'bg-green-100 text-green-700';
    case OrderStatus.NEW: return 'bg-blue-100 text-blue-700';
    case OrderStatus.CONFIRMED: return 'bg-indigo-100 text-indigo-700';
    case OrderStatus.ASSIGNED: return 'bg-purple-100 text-purple-700';
    case OrderStatus.IN_PROGRESS: return 'bg-amber-100 text-amber-700';
    case OrderStatus.PICKED_UP: return 'bg-orange-100 text-orange-700';
    case OrderStatus.CANCELLED: return 'bg-red-100 text-red-700';
    case OrderStatus.NO_SHOW: return 'bg-gray-100 text-gray-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const Calendar: React.FC = () => {
  const { orders, loading } = useData();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Group orders by date
  const groupedOrders = orders.reduce((acc, order) => {
    const date = order.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(order);
    return acc;
  }, {} as Record<string, Order[]>);

  const sortedDates = Object.keys(groupedOrders).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (loading && orders.length === 0) {
      return <div className="p-8 text-center text-gray-500">Loading schedule...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">Schedule</h2>
           <p className="text-sm text-slate-500">Timeline of all past and upcoming movements.</p>
        </div>
        <div className="flex gap-2">
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><ChevronLeft className="w-5 h-5 text-gray-600"/></button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
                Today
            </button>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><ChevronRight className="w-5 h-5 text-gray-600"/></button>
        </div>
      </div>

      <div className="space-y-8">
        {sortedDates.map(date => {
            const dayOrders = groupedOrders[date];
            const dateObj = new Date(date);
            const isToday = new Date().toISOString().split('T')[0] === date;

            return (
                <div key={date} className="relative">
                    <div className="sticky top-16 z-10 bg-gray-50 pb-4 pt-2 flex items-center gap-4">
                        <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${isToday ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-700 border-gray-200'}`}>
                            {dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="h-px bg-gray-200 flex-1"></div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {dayOrders.map(order => (
                            <div 
                                key={order.id} 
                                onClick={() => setSelectedOrder(order)}
                                className="cursor-pointer bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition flex flex-col md:flex-row md:items-center gap-4"
                            >
                                <div className="md:w-48 flex flex-row md:flex-col items-center md:items-start justify-between">
                                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                                        <Clock className="w-4 h-4" />
                                        <span>09:00 AM</span>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${getStatusColor(order.status)} mt-0 md:mt-2`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-start gap-3">
                                        <div className="flex flex-col items-center mt-1">
                                            <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                                            <div className="w-0.5 h-6 bg-slate-200"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{order.route.from}</p>
                                                <p className="text-xs text-slate-500">Pick-up location</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{order.route.to}</p>
                                                <p className="text-xs text-slate-500">Drop-off destination</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:w-64 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Client</p>
                                            <p className="text-sm font-medium text-slate-900 truncate">{order.clientName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div>
                                            <p className="text-xs text-gray-500">ID</p>
                                            <p className="text-sm font-mono text-slate-600">{order.id}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        })}
      </div>

      {/* Quick View Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <h3 className="font-bold text-slate-800">Order Quick View</h3>
                    <button onClick={() => setSelectedOrder(null)} className="p-1 hover:bg-gray-200 rounded-full transition">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                         <span className="text-lg font-bold text-slate-900">{selectedOrder.id}</span>
                         <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(selectedOrder.status)}`}>
                            {selectedOrder.status}
                         </span>
                    </div>
                    <div className="space-y-3">
                         <div className="flex gap-3">
                             <MapPin className="w-5 h-5 text-gray-400" />
                             <div className="text-sm">
                                 <p className="text-slate-500 text-xs uppercase tracking-wide">Route</p>
                                 <p className="font-medium">{selectedOrder.route.from} → {selectedOrder.route.to}</p>
                             </div>
                         </div>
                         <div className="flex gap-3">
                             <User className="w-5 h-5 text-gray-400" />
                             <div className="text-sm">
                                 <p className="text-slate-500 text-xs uppercase tracking-wide">Client</p>
                                 <p className="font-medium">{selectedOrder.clientName}</p>
                             </div>
                         </div>
                         <div className="flex gap-3">
                             <Clock className="w-5 h-5 text-gray-400" />
                             <div className="text-sm">
                                 <p className="text-slate-500 text-xs uppercase tracking-wide">Date</p>
                                 <p className="font-medium">{selectedOrder.date}</p>
                             </div>
                         </div>
                    </div>
                    <button 
                        onClick={() => setSelectedOrder(null)}
                        className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;