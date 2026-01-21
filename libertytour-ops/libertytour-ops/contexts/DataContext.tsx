import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus, User, UserRole, Client, Executor } from '../types';
import { db } from '../services/db';

interface DataContextType {
  currentUser: User;
  switchRole: (role: UserRole) => void;
  
  orders: Order[];
  clients: Client[];
  executors: Executor[];
  
  stats: {
    totalOrders: number;
    activeOrders: number;
    completedToday: number;
    revenue: number;
  };
  loading: boolean;
  
  refreshData: () => Promise<void>;
  updateOrder: (orderId: string, status: OrderStatus) => Promise<void>;
  regenerateVoucher: (orderId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock Users
const MOCK_USERS: Record<UserRole, User> = {
    [UserRole.ADMIN]: { id: 'USR-001', name: 'Admin User', role: UserRole.ADMIN },
    [UserRole.DISPATCHER]: { id: 'USR-002', name: 'Dispatcher Dave', role: UserRole.DISPATCHER },
    [UserRole.DRIVER]: { id: 'EX-001', name: 'Mike Ross', role: UserRole.DRIVER }, // Matches Executor ID
    [UserRole.PARTNER]: { id: 'CL-101', name: 'Acme Corp', role: UserRole.PARTNER }, // Matches Client ID
    [UserRole.ACCOUNTANT]: { id: 'USR-003', name: 'Angela Martin', role: UserRole.ACCOUNTANT },
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[UserRole.ADMIN]);
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [executors, setExecutors] = useState<Executor[]>([]);
  const [stats, setStats] = useState({ totalOrders: 0, activeOrders: 0, completedToday: 0, revenue: 0 });
  
  const [loading, setLoading] = useState(true);

  const switchRole = (role: UserRole) => {
    setCurrentUser(MOCK_USERS[role]);
    refreshData(MOCK_USERS[role]); // Refresh data with new role context
  };

  const refreshData = useCallback(async (userOverride?: User) => {
    const user = userOverride || currentUser;
    if (orders.length === 0) setLoading(true);
    
    try {
      const [allOrders, allClients, allExecutors, fetchedStats] = await Promise.all([
        db.getOrders(),
        db.getClients(),
        db.getExecutors(),
        db.getStats()
      ]);

      // --- RBAC FILTERING LOGIC ---
      let filteredOrders = allOrders;

      if (user.role === UserRole.DRIVER) {
        // Drivers only see orders assigned to them
        filteredOrders = allOrders.filter(o => o.executorId === user.id);
      } else if (user.role === UserRole.PARTNER) {
        // Partners only see their own orders
        filteredOrders = allOrders.filter(o => o.clientId === user.id);
      }

      setOrders(filteredOrders);
      setClients(allClients);
      setExecutors(allExecutors);
      setStats(fetchedStats);
    } catch (e) {
      console.error("Data sync failed", e);
    } finally {
      setLoading(false);
    }
  }, [currentUser, orders.length]);

  const updateOrder = async (orderId: string, status: OrderStatus) => {
      try {
        await db.updateOrderStatus(orderId, status, currentUser.id);
        await refreshData();
      } catch (e) {
        console.error("Failed to update order", e);
        throw e;
      }
  };

  const regenerateVoucher = async (orderId: string) => {
      try {
          await db.regenerateVoucher(orderId, currentUser.id);
          await refreshData();
      } catch (e) {
          console.error("Failed to regenerate voucher", e);
          throw e;
      }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <DataContext.Provider value={{ 
        currentUser, 
        switchRole, 
        orders, 
        clients, 
        executors, 
        stats, 
        loading, 
        refreshData, 
        updateOrder,
        regenerateVoucher 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};