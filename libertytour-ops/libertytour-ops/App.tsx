import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Calendar from './pages/Calendar';
import Reports from './pages/Reports';
import Clients from './pages/Clients';
import Executors from './pages/Executors';
import Voucher from './pages/Voucher';
import ModulePlaceholder from './pages/ModulePlaceholder';
import { DataProvider } from './contexts/DataContext';

const App: React.FC = () => {
  return (
    <HashRouter>
      <DataProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="clients" element={<Clients />} />
            <Route path="executors" element={<Executors />} />
            <Route path="pricing" element={<ModulePlaceholder />} />
            <Route path="voucher" element={<Voucher />} />
            <Route path="communications" element={<ModulePlaceholder />} />
            <Route path="integrations" element={<ModulePlaceholder />} />
            <Route path="reports" element={<Reports />} />
            <Route path="content" element={<ModulePlaceholder />} />
            <Route path="settings" element={<ModulePlaceholder />} />
            {/* Catch all redirect to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </DataProvider>
    </HashRouter>
  );
};

export default App;