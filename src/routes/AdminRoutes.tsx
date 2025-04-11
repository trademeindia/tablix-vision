
import React from 'react';
import { Routes } from 'react-router-dom';
import {
  DashboardRoutes,
  MenuRoutes,
  OrderRoutes,
  QRCodeRoutes,
  TableRoutes,
  StaffRoutes,
  CustomerRoutes,
  InvoiceRoutes,
  InventoryRoutes,
  MarketingRoutes,
  SettingsRoutes
} from './admin';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Dashboard & Analytics */}
      <DashboardRoutes />
      
      {/* Menu Management */}
      <MenuRoutes />
      
      {/* Order Management */}
      <OrderRoutes />
      
      {/* QR Code Management */}
      <QRCodeRoutes />
      
      {/* Table Management */}
      <TableRoutes />
      
      {/* Staff Management */}
      <StaffRoutes />
      
      {/* Customer Management */}
      <CustomerRoutes />
      
      {/* Invoice Management */}
      <InvoiceRoutes />
      
      {/* Inventory Management */}
      <InventoryRoutes />
      
      {/* Marketing & Integrations */}
      <MarketingRoutes />
      
      {/* Settings */}
      <SettingsRoutes />
    </Routes>
  );
};

export default AdminRoutes;
