import React from 'react';
import { Construction } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ModulePlaceholder: React.FC = () => {
  const location = useLocation();
  const moduleName = location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.substring(2);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white rounded-xl border border-gray-200 shadow-sm border-dashed">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
        <Construction className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">{moduleName} Module</h2>
      <p className="text-gray-500 max-w-md">
        This operations module is currently under active development. 
        Please refer to the ERD and business logic documentation for implementation details.
      </p>
      
      <div className="mt-8 flex gap-4">
        <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition text-sm font-medium">
            View Documentation
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
            Contact Admin
        </button>
      </div>
    </div>
  );
};

export default ModulePlaceholder;