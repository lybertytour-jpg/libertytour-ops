import React from 'react';
import { ArrowUpRight, ArrowDownRight, Users, ShoppingCart, Activity, AlertCircle, RefreshCw } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { MetricCardProps, OrderStatus } from '../types';
import { useData } from '../contexts/DataContext';

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, trendUp, icon: Icon }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      {trend && (
        <div className={`flex items-center mt-2 text-xs font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trendUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          <span>{trend} vs last period</span>
        </div>
      )}
    </div>
    <div className="p-2 bg-gray-50 rounded-lg">
      <Icon className="w-5 h-5 text-slate-600" />
    </div>
  </div>
);

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.COMPLETED: return 'bg-green-100 text-green-700';
    case OrderStatus.NEW: return 'bg-blue-100 text-blue-700';
    case OrderStatus.CONFIRMED: return 'bg-indigo-100 text-indigo-700';
    case OrderStatus.IN_PROGRESS: return 'bg-amber-100 text-amber-700';
    case OrderStatus.CANCELLED: return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { orders, stats, loading } = useData();

  // Mock Chart Data - visualized for UI demo purposes
  const chartData = [
    { name: '00:00', orders: 4 },
    { name: '04:00', orders: 2 },
    { name: '08:00', orders: 15 },
    { name: '12:00', orders: 25 },
    { name: '16:00', orders: 20 },
    { name: '20:00', orders: 10 },
    { name: '23:59', orders: 5 },
  ];

  const activityData = [
    { name: 'Mon', active: 40 },
    { name: 'Tue', active: 30 },
    { name: 'Wed', active: 55 },
    { name: 'Thu', active: 45 },
    { name: 'Fri', active: 60 },
    { name: 'Sat', active: 75 },
    { name: 'Sun', active: 65 },
  ];

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Orders" value={stats.totalOrders.toString()} trend="12%" trendUp={true} icon={ShoppingCart} />
        <MetricCard title="Active Ops" value={stats.activeOrders.toString()} trend="4%" trendUp={true} icon={Activity} />
        <MetricCard title="Revenue (Est)" value={`$${stats.revenue.toLocaleString()}`} trend="2.5%" trendUp={false} icon={AlertCircle} />
        <MetricCard title="Completed Today" value={stats.completedToday.toString()} trend="On Track" trendUp={true} icon={Users} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Orders Overview (24h)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                    cursor={{ stroke: '#94a3b8', strokeWidth: 1 }}
                />
                <Line type="monotone" dataKey="orders" stroke="#2563eb" strokeWidth={3} dot={{r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Weekly Activity</h3>
          <div className="h-72">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                 <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                 />
                <Bar dataKey="active" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

       {/* Recent Orders Table */}
       <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
         <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800">Recent Orders</h3>
            <button 
              onClick={() => navigate('/orders')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                    <tr>
                        <th className="px-6 py-3">Order ID</th>
                        <th className="px-6 py-3">Client</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Route</th>
                        <th className="px-6 py-3">Amount</th>
                        <th className="px-6 py-3">Date</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {orders.slice(0, 5).map(order => (
                      <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                          <td className="px-6 py-4">{order.clientName}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 truncate max-w-xs" title={`${order.route.from} -> ${order.route.to}`}>
                             {order.route.from} → {order.route.to}
                          </td>
                          <td className="px-6 py-4">${order.amount.toFixed(2)}</td>
                          <td className="px-6 py-4">{order.date}</td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No active orders found</td>
                      </tr>
                    )}
                </tbody>
            </table>
         </div>
       </div>
    </div>
  );
};

export default Dashboard;