import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Download, Calendar } from 'lucide-react';
import { OrderStatus } from '../types';
import { useData } from '../contexts/DataContext';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#8b5cf6'];

const Reports: React.FC = () => {
  const { orders, loading } = useData();

  // --- Aggregations ---

  // 1. Revenue per Day (Last 7 days approx from data)
  const revenueMap = orders.reduce((acc, order) => {
    // Only count completed for revenue
    if (order.status === OrderStatus.COMPLETED) {
        acc[order.date] = (acc[order.date] || 0) + order.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const revenueData = Object.keys(revenueMap)
    .sort()
    .slice(-7) // Last 7 available days
    .map(date => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: revenueMap[date]
    }));

  // 2. Orders by Status
  const statusMap = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.keys(statusMap).map(status => ({
    name: status,
    value: statusMap[status]
  }));

  // 3. KPI Summary
  const totalRevenue = orders
    .filter(o => o.status === OrderStatus.COMPLETED)
    .reduce((sum, o) => sum + o.amount, 0);
  
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / orders.filter(o => o.status === OrderStatus.COMPLETED).length : 0;
  const cancelRate = (orders.filter(o => o.status === OrderStatus.CANCELLED).length / totalOrders) * 100;

  if (loading && orders.length === 0) return <div className="p-8 text-center text-gray-500">Generating reports...</div>;

  return (
    <div className="space-y-8">
       {/* Header */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">Financial Reports</h2>
           <p className="text-sm text-slate-500">Operational performance and revenue analytics.</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 bg-white">
                <Calendar className="w-4 h-4 text-gray-500"/>
                Last 30 Days
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm">
                <Download className="w-4 h-4"/>
                Export CSV
            </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
            <h3 className="text-2xl font-bold text-slate-900">${totalRevenue.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Total Orders</p>
            <h3 className="text-2xl font-bold text-slate-900">{totalOrders}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Avg. Order Value</p>
            <h3 className="text-2xl font-bold text-slate-900">${Math.round(avgOrderValue)}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Cancellation Rate</p>
            <h3 className={`text-2xl font-bold ${!isNaN(cancelRate) && cancelRate > 10 ? 'text-red-600' : 'text-green-600'}`}>
                {isNaN(cancelRate) ? '0' : cancelRate.toFixed(1)}%
            </h3>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue Trend</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <Tooltip 
                            cursor={{fill: '#f1f5f9'}}
                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                        />
                        <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Order Status Distribution</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={110}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {statusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Reports;