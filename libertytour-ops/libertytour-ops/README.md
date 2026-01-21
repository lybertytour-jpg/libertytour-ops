# LibertyTour Ops (Internal System)

## Overview
This is the internal Operational System for LibertyTour management. It is a strictly internal tool designed for Admins, Dispatchers, Drivers, and B2B Partners to manage transfers, orders, and financial reporting.

## Key Features
*   **Centralized Data Layer:** Single source of truth for all modules.
*   **RBAC (Role-Based Access Control):** Data visibility tailored to user roles.
*   **Ops-First UI:** Focus on efficiency, data density, and clear status indicators.

## User Roles
1.  **ADMIN:** Full access to all modules, settings, and pricing.
2.  **DISPATCHER:** Operational access (Orders, Clients, Executors). No financial settings.
3.  **DRIVER:** Limited view. Only sees assigned orders. No financial data.
4.  **PARTNER:** B2B view. Only sees own orders and vouchers.
5.  **ACCOUNTANT:** View-only access to Reports and Pricing.

## Modules status
*   **Dashboard:** Live.
*   **Orders:** Live. Includes State Machine for status transitions.
*   **Calendar:** Live. Synchronized with Orders.
*   **Reports:** Live. Financial aggregations.
*   **Clients/Executors:** Live. List views connected to DB.
*   **Voucher:** Live logic. Token regeneration supported.

## Running Locally
1.  `npm install`
2.  `npm start`

**Note:** This is a frontend MVP with a mocked `db.ts` service layer. No real backend is connected.
