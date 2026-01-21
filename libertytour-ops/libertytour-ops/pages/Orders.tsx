import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  X, 
  MapPin, 
  User, 
  Calendar, 
  CreditCard,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Order, OrderStatus, UserRole } from '../types';
import { VALID_TRANSITIONS } from '../services/db';
import { useData } from '../contexts/DataContext';

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.COMPLETED: return 'bg-green-100 text-green-700 border-green-200';
    case OrderStatus.NEW: return 'bg-blue-100 text-blue-700 border-blue-200';
    case OrderStatus.CONFIRMED: return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    case OrderStatus.ASSIGNED: return 'bg-purple-100 text-purple-700 border-purple-200';
    case OrderStatus.IN_PROGRESS: return 'bg-amber-100 text-amber-700 border-amber-200';
    case OrderStatus.PICKED_UP: return 'bg-orange-100 text-orange-700 border-orange-200';
    case OrderStatus.CANCELLED: return 'bg-red-100 text-red-700 border-red-200';
    case OrderStatus.NO_SHOW: return 'bg-gray-100 text-gray-700 border-gray-200';
    default: return 'bg-gray-50 text-gray-600 border-gray-200';
  }
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

const Orders: React.FC = () => {
  const { orders, loading, updateOrder, currentUser } = useData();
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');

  // Drawer State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Filter Logic
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      order.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Actions
  const openDrawer = (order: Order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      await updateOrder(selectedOrder.id, newStatus);
      // Optimistically update selected order in drawer view
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (e) {
      alert("Failed to update status: " + (e as Error).message);
    } finally {
      setUpdating(false);
    }
  };

  // RBAC Checks
  const showFinancials = currentUser.role !== UserRole.DRIVER;
  const canEdit = [UserRole.ADMIN, UserRole.DISPATCHER].includes(currentUser.role);

  return (
    <div className="space-y-6">
      {/* Header & Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">Order Management</h2>
           <p className="text-sm text-slate-500">View and manage dispatch operations.</p>
        </div>
        {canEdit && (
            <div className="flex items-center gap-3">
                <button 
                  onClick={() => alert("Create Order Screen is under development. Please use the Import feature for bulk uploads.")} 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm"
                >
                    + Create Order
                </button>
            </div>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text"
                    placeholder="Search ID, Client..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                />
            </div>
            <div className="relative">
                <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
                    className="pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                >
                    <option value="ALL">All Statuses</option>
                    {Object.values(OrderStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>
        </div>
        <div className="text-sm text-gray-500">
            Showing <span className="font-semibold">{filteredOrders.length}</span> results
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 font-semibold text-slate-600 uppercase text-xs tracking-wider">Order ID</th>
                        <th className="px-6 py-4 font-semibold text-slate-600 uppercase text-xs tracking-wider">Status</th>
                        <th className="px-6 py-4 font-semibold text-slate-600 uppercase text-xs tracking-wider">Date</th>
                        <th className="px-6 py-4 font-semibold text-slate-600 uppercase text-xs tracking-wider">Client</th>
                        <th className="px-6 py-4 font-semibold text-slate-600 uppercase text-xs tracking-wider">Route</th>
                        {showFinancials && <th className="px-6 py-4 font-semibold text-slate-600 uppercase text-xs tracking-wider text-right">Amount</th>}
                        <th className="px-6 py-4 font-semibold text-slate-600 uppercase text-xs tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {loading && orders.length === 0 ? (
                        <tr>
                            <td colSpan={showFinancials ? 7 : 6} className="px-6 py-8 text-center text-gray-500">Loading orders...</td>
                        </tr>
                    ) : filteredOrders.length === 0 ? (
                        <tr>
                            <td colSpan={showFinancials ? 7 : 6} className="px-6 py-8 text-center text-gray-500">No orders found matching your criteria.</td>
                        </tr>
                    ) : (
                        filteredOrders.map(order => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{order.date}</td>
                                <td className="px-6 py-4 text-slate-700">{order.clientName}</td>
                                <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={`${order.route.from} → ${order.route.to}`}>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                        {order.route.from}
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                        {order.route.to}
                                    </div>
                                </td>
                                {showFinancials && (
                                    <td className="px-6 py-4 text-right font-medium text-slate-900">
                                        {formatCurrency(order.amount, order.currency)}
                                    </td>
                                )}
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => openDrawer(order)}
                                        className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* Details Drawer */}
      {isDrawerOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={closeDrawer}></div>
            <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 bg-gray-50">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">{selectedOrder.id}</h3>
                        <p className="text-xs text-gray-500">Created on {selectedOrder.createdAt.toLocaleDateString()}</p>
                    </div>
                    <button onClick={closeDrawer} className="p-2 hover:bg-gray-200 rounded-full transition">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    
                    <div className="bg-white rounded-lg">
                         <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Current Status</h4>
                         </div>
                         <div className="flex items-center gap-3">
                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusColor(selectedOrder.status)}`}>
                                {selectedOrder.status}
                            </span>
                         </div>
                    </div>

                    <div>
                         <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Available Actions</h4>
                         <div className="flex flex-wrap gap-2">
                             {VALID_TRANSITIONS[selectedOrder.status].map((nextStatus) => (
                                 <button
                                    key={nextStatus}
                                    disabled={updating}
                                    onClick={() => handleStatusChange(nextStatus)}
                                    className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-md hover:bg-slate-700 active:bg-slate-900 disabled:opacity-50 transition shadow-sm"
                                 >
                                    Mark as {nextStatus}
                                 </button>
                             ))}
                             {VALID_TRANSITIONS[selectedOrder.status].length === 0 && (
                                 <span className="text-sm text-gray-400 italic flex items-center gap-2">
                                     <CheckCircle2 className="w-4 h-4" />
                                     No further actions available (Terminal State)
                                 </span>
                             )}
                         </div>
                         {/* Driver Safety Warning */}
                         {currentUser.role === UserRole.DRIVER && selectedOrder.status === OrderStatus.IN_PROGRESS && (
                            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-3 text-sm text-amber-800">
                                <AlertTriangle className="w-5 h-5 shrink-0" />
                                <p>Do not interact with the app while driving. Update status only when safe.</p>
                            </div>
                         )}
                    </div>

                    <div className="border-t border-gray-100 my-4"></div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="flex items-start gap-3">
                            <User className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-slate-900">Client</p>
                                <p className="text-sm text-slate-600">{selectedOrder.clientName}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div className="w-full">
                                <p className="text-sm font-medium text-slate-900 mb-2">Route Details</p>
                                <div className="relative pl-4 border-l-2 border-gray-200 space-y-4">
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 w-3 h-3 bg-white border-2 border-slate-400 rounded-full"></div>
                                        <p className="text-xs text-gray-500">Pick Up</p>
                                        <p className="text-sm text-slate-800 font-medium">{selectedOrder.route.from}</p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 w-3 h-3 bg-white border-2 border-blue-600 rounded-full"></div>
                                        <p className="text-xs text-gray-500">Drop Off</p>
                                        <p className="text-sm text-slate-800 font-medium">{selectedOrder.route.to}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-slate-900">Schedule</p>
                                <p className="text-sm text-slate-600">{selectedOrder.date}</p>
                            </div>
                        </div>

                        {showFinancials && (
                            <div className="flex items-start gap-3">
                                <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-slate-900">Financials</p>
                                    <p className="text-lg font-bold text-slate-800">{formatCurrency(selectedOrder.amount, selectedOrder.currency)}</p>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 mt-1">
                                        Paid
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Drawer Footer */}
                {showFinancials && (
                    <div className="p-6 bg-gray-50 border-t border-gray-200">
                        <button 
                            onClick={() => alert("Invoice PDF generation is pending backend integration.")}
                            className="w-full py-2 bg-white border border-gray-300 text-slate-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition"
                        >
                            View Full Invoice
                        </button>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default Orders;