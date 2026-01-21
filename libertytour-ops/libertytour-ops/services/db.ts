import { Order, OrderStatus, AuditLog, OrderStatusHistory, Client, Executor, Voucher } from "../types";

// Valid State Transitions Map (State Machine)
export const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.NEW]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  [OrderStatus.CONFIRMED]: [OrderStatus.ASSIGNED, OrderStatus.CANCELLED],
  [OrderStatus.ASSIGNED]: [OrderStatus.IN_PROGRESS, OrderStatus.NO_SHOW, OrderStatus.CANCELLED],
  [OrderStatus.IN_PROGRESS]: [OrderStatus.PICKED_UP, OrderStatus.CANCELLED], 
  [OrderStatus.PICKED_UP]: [OrderStatus.COMPLETED], 
  [OrderStatus.COMPLETED]: [], 
  [OrderStatus.NO_SHOW]: [], 
  [OrderStatus.CANCELLED]: [], 
};

class MockDatabase {
  private orders: Order[] = [];
  private clients: Client[] = [];
  private executors: Executor[] = [];
  private auditLogs: AuditLog[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    const today = new Date();
    const fmtDate = (d: Date) => d.toISOString().split('T')[0];

    // Seed Clients
    this.clients = [
      { id: "CL-101", name: "Acme Corp Travel", email: "corp@acme.com", phone: "+15550101", type: "B2B", totalOrders: 12 },
      { id: "CL-102", name: "John Doe", email: "john@gmail.com", phone: "+15550102", type: "B2C", totalOrders: 1 },
      { id: "CL-103", name: "Global Tech Summit", email: "events@global.com", phone: "+15550103", type: "B2B", totalOrders: 45 },
      { id: "CL-104", name: "Alice Smith", email: "alice@yahoo.com", phone: "+15550104", type: "B2C", totalOrders: 3 },
      { id: "CL-105", name: "Consulting Partners LLC", email: "travel@consult.com", phone: "+15550105", type: "B2B", totalOrders: 8 }
    ];

    // Seed Executors (Drivers)
    this.executors = [
      { id: "EX-001", name: "Mike Ross", phone: "+15550201", vehicle: "Mercedes V-Class (Black)", status: "ACTIVE" },
      { id: "EX-002", name: "Harvey Specter", phone: "+15550202", vehicle: "Cadillac Escalade", status: "BUSY" },
      { id: "EX-003", name: "Louis Litt", phone: "+15550203", vehicle: "BMW 7 Series", status: "OFFLINE" }
    ];

    const routes = [
      { from: "JFK Airport", to: "Manhattan Content Center" },
      { from: "Brooklyn Heights", to: "LGA Airport" },
      { from: "Newark Airport", to: "Stamford, CT" },
      { from: "Central Park", to: "SoHo Hotel" },
      { from: "Wall St", to: "JFK Airport" }
    ];

    // Generate 50 mock orders
    for (let i = 0; i < 50; i++) {
      const dayOffset = Math.floor(Math.random() * 37) - 30; // -30 to +7 days
      const date = new Date(today);
      date.setDate(date.getDate() + dayOffset);
      
      const isPast = dayOffset < 0;
      const status = isPast 
        ? (Math.random() > 0.8 ? OrderStatus.CANCELLED : OrderStatus.COMPLETED)
        : (dayOffset === 0 ? OrderStatus.IN_PROGRESS : (Math.random() > 0.5 ? OrderStatus.CONFIRMED : OrderStatus.NEW));

      const client = this.clients[Math.floor(Math.random() * this.clients.length)];
      const route = routes[Math.floor(Math.random() * routes.length)];
      const amount = Math.floor(Math.random() * 500) + 50;
      const executor = status !== OrderStatus.NEW && status !== OrderStatus.CONFIRMED 
        ? this.executors[Math.floor(Math.random() * this.executors.length)]
        : undefined;

      // Mock Voucher
      const voucher: Voucher = {
        orderId: `ORD-${7700 + i}`,
        token: Math.random().toString(36).substring(7).toUpperCase(),
        isActive: status !== OrderStatus.CANCELLED,
        generatedAt: date,
        expiresAt: new Date(date.getTime() + 1000 * 60 * 60 * 48) // +48h
      };

      this.orders.push({
        id: `ORD-${7700 + i}`,
        clientId: client.id,
        clientName: client.name,
        executorId: executor?.id,
        amount: amount,
        currency: "USD",
        status: status,
        date: fmtDate(date),
        route: route,
        statusHistory: [],
        voucher: voucher,
        createdAt: date,
        updatedAt: date
      });
    }
  }

  // --- Read Operations ---

  async getOrders(): Promise<Order[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sorted = [...this.orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        resolve(sorted);
      }, 300);
    });
  }

  async getClients(): Promise<Client[]> {
    return Promise.resolve([...this.clients]);
  }

  async getExecutors(): Promise<Executor[]> {
    return Promise.resolve([...this.executors]);
  }

  async getStats() {
    const todayStr = new Date().toISOString().split('T')[0];

    return {
      totalOrders: this.orders.length,
      activeOrders: this.orders.filter(o => 
        [OrderStatus.NEW, OrderStatus.CONFIRMED, OrderStatus.ASSIGNED, OrderStatus.IN_PROGRESS].includes(o.status)
      ).length,
      completedToday: this.orders.filter(o => 
        o.status === OrderStatus.COMPLETED && o.date === todayStr
      ).length, 
      revenue: this.orders.reduce((acc, curr) => acc + curr.amount, 0)
    };
  }

  // --- Write Operations ---

  async updateOrderStatus(orderId: string, newStatus: OrderStatus, userId: string, reason?: string): Promise<Order> {
    const orderIndex = this.orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) throw new Error(`Order ${orderId} not found`);

    const order = this.orders[orderIndex];
    const currentStatus = order.status;

    // Validate Transition
    const allowed = VALID_TRANSITIONS[currentStatus];
    if (!allowed.includes(newStatus)) {
      throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
    }

    const historyEntry: OrderStatusHistory = {
      from: currentStatus,
      to: newStatus,
      timestamp: new Date(),
      changedBy: userId,
      reason
    };

    const log: AuditLog = {
      id: Date.now().toString(),
      entityId: orderId,
      entityType: 'ORDER',
      action: 'STATUS_CHANGE',
      timestamp: new Date(),
      performedBy: userId,
      details: `Status changed from ${currentStatus} to ${newStatus}`
    };

    const updatedOrder = {
      ...order,
      status: newStatus,
      statusHistory: [...order.statusHistory, historyEntry],
      updatedAt: new Date()
    };

    this.orders[orderIndex] = updatedOrder;
    this.auditLogs.push(log);

    return updatedOrder;
  }

  async regenerateVoucher(orderId: string, userId: string): Promise<Voucher> {
    const orderIndex = this.orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) throw new Error(`Order ${orderId} not found`);
    
    const order = this.orders[orderIndex];
    if (!order.voucher) throw new Error("Order has no voucher");

    // Deactivate old
    // In a real DB, we would mark the old row as inactive. Here we just replace.
    const newToken = Math.random().toString(36).substring(7).toUpperCase();
    
    const newVoucher: Voucher = {
        ...order.voucher,
        token: newToken,
        isActive: true,
        generatedAt: new Date()
    };

    const log: AuditLog = {
      id: Date.now().toString(),
      entityId: orderId,
      entityType: 'VOUCHER',
      action: 'REGENERATE_TOKEN',
      timestamp: new Date(),
      performedBy: userId,
      details: `Voucher regenerated. Old token invalidated.`
    };

    this.orders[orderIndex] = { ...order, voucher: newVoucher };
    this.auditLogs.push(log);

    return newVoucher;
  }
}

export const db = new MockDatabase();