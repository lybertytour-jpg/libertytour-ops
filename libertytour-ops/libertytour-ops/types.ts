import { LucideIcon } from 'lucide-react';

export enum UserRole {
  ADMIN = 'ADMIN',
  DISPATCHER = 'DISPATCHER',
  DRIVER = 'DRIVER',
  PARTNER = 'PARTNER',
  ACCOUNTANT = 'ACCOUNTANT'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export enum OrderStatus {
  NEW = 'NEW',
  CONFIRMED = 'CONFIRMED',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  PICKED_UP = 'PICKED_UP',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
  CANCELLED = 'CANCELLED'
}

export interface OrderStatusHistory {
  from: OrderStatus | null;
  to: OrderStatus;
  timestamp: Date;
  changedBy: string; // User ID
  reason?: string;
}

export interface AuditLog {
  id: string;
  entityId: string;
  entityType: 'ORDER' | 'CLIENT' | 'EXECUTOR' | 'VOUCHER';
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE' | 'REGENERATE_TOKEN';
  timestamp: Date;
  performedBy: string;
  details: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'B2B' | 'B2C';
  totalOrders: number;
}

export interface Executor {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  status: 'ACTIVE' | 'BUSY' | 'OFFLINE';
}

export interface Voucher {
  orderId: string;
  token: string;
  isActive: boolean;
  generatedAt: Date;
  expiresAt: Date;
}

export interface Order {
  id: string;
  clientId: string;
  clientName: string; 
  executorId?: string; // Assigned driver
  amount: number;
  currency: string;
  status: OrderStatus;
  date: string; // ISO Date
  route: {
    from: string;
    to: string;
  };
  statusHistory: OrderStatusHistory[];
  voucher?: Voucher;
  createdAt: Date;
  updatedAt: Date;
}

// UI Types
export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  roles?: UserRole[]; // RBAC
}

export interface MetricCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}