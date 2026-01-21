import React from 'react';
import { Search, Bell, Sparkles, HelpCircle, UserCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { UserRole } from '../types';

interface HeaderProps {
  toggleAI: () => void;
  isAIOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleAI, isAIOpen }) => {
  const location = useLocation();
  const { currentUser, switchRole } = useData();
  const pageName = location.pathname === '/' ? 'Dashboard' : location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.substring(2);

  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-10 flex items-center justify-between px-6 shadow-sm">
      
      {/* Page Title / Breadcrumbs */}
      <div>
        <h1 className="text-lg font-semibold text-slate-800 capitalize">{pageName}</h1>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        
        {/* MVP ROLE SWITCHER - FOR DEMO ONLY */}
        <div className="hidden lg:flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded border border-yellow-200">
            <span className="text-xs text-yellow-800 font-bold uppercase">Demo Mode:</span>
            <select 
                value={currentUser.role}
                onChange={(e) => switchRole(e.target.value as UserRole)}
                className="bg-transparent text-xs text-slate-800 outline-none cursor-pointer font-medium"
            >
                {Object.values(UserRole).map(role => (
                    <option key={role} value={role}>{role}</option>
                ))}
            </select>
        </div>

        {/* Global Search */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search orders, clients..." 
            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none w-64 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

         {/* Help */}
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition">
            <HelpCircle className="w-5 h-5" />
        </button>

        {/* AI Toggle */}
        <button 
            onClick={toggleAI}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                isAIOpen 
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-2 ring-indigo-100' 
                : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:text-indigo-600'
            }`}
        >
            <Sparkles className="w-4 h-4" />
            <span>AI Ops</span>
        </button>
      </div>
    </header>
  );
};

export default Header;