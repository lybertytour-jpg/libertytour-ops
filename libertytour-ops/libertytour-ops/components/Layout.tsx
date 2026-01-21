import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import AIAssistant from './AIAssistant';

const Layout: React.FC = () => {
  const [isAIOpen, setIsAIOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header toggleAI={() => setIsAIOpen(!isAIOpen)} isAIOpen={isAIOpen} />
      
      {/* Main Content */}
      <main className={`pt-16 pl-64 transition-all duration-300 ${isAIOpen ? 'pr-96' : ''}`}>
        <div className="p-8">
            <Outlet />
        </div>
      </main>

      {/* AI Sidebar */}
      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
};

export default Layout;