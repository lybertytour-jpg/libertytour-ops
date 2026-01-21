import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  CalendarDays, 
  Users, 
  Briefcase, 
  Tag, 
  Ticket, 
  MessageSquare, 
  Network, 
  BarChart3, 
  FileText, 
  Settings 
} from 'lucide-react';
import { NavItem, UserRole } from '../types';
import { useData } from '../contexts/DataContext';

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.DISPATCHER, UserRole.PARTNER, UserRole.DRIVER] },
  { id: 'orders', label: 'Orders', path: '/orders', icon: ShoppingCart, roles: [UserRole.ADMIN, UserRole.DISPATCHER, UserRole.PARTNER, UserRole.DRIVER] },
  { id: 'calendar', label: 'Calendar', path: '/calendar', icon: CalendarDays, roles: [UserRole.ADMIN, UserRole.DISPATCHER, UserRole.DRIVER] },
  { id: 'clients', label: 'Clients', path: '/clients', icon: Users, roles: [UserRole.ADMIN, UserRole.DISPATCHER] },
  { id: 'executors', label: 'Executors', path: '/executors', icon: Briefcase, roles: [UserRole.ADMIN, UserRole.DISPATCHER] },
  { id: 'pricing', label: 'Pricing', path: '/pricing', icon: Tag, roles: [UserRole.ADMIN, UserRole.ACCOUNTANT] },
  { id: 'voucher', label: 'Voucher', path: '/voucher', icon: Ticket, roles: [UserRole.ADMIN, UserRole.DISPATCHER, UserRole.PARTNER] },
  { id: 'communications', label: 'Communications', path: '/communications', icon: MessageSquare, roles: [UserRole.ADMIN, UserRole.DISPATCHER] },
  { id: 'integrations', label: 'Integrations', path: '/integrations', icon: Network, roles: [UserRole.ADMIN] },
  { id: 'reports', label: 'Reports', path: '/reports', icon: BarChart3, roles: [UserRole.ADMIN, UserRole.ACCOUNTANT] },
  { id: 'content', label: 'Content', path: '/content', icon: FileText, roles: [UserRole.ADMIN] },
  { id: 'settings', label: 'Settings', path: '/settings', icon: Settings, roles: [UserRole.ADMIN] },
];

const Sidebar: React.FC = () => {
  const { currentUser } = useData();

  // Filter items based on role
  const allowedItems = navItems.filter(item => item.roles?.includes(currentUser.role));

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed inset-y-0 left-0 z-20 transition-all duration-300">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-2 font-bold text-white text-xl tracking-tight">
            <span className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white">L</span>
            <span>Liberty<span className="text-blue-500 font-light">Ops</span></span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {allowedItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User Info / Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                {currentUser.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
                <p className="text-xs text-slate-500">{currentUser.role}</p>
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;