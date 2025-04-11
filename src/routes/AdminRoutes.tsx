
import React from 'react';
import { Routes } from 'react-router-dom';
import DashboardRoutes from './admin/DashboardRoutes';
import MenuRoutes from './admin/MenuRoutes';
import OrderRoutes from './admin/OrderRoutes';
import QRCodeRoutes from './admin/QRCodeRoutes';
import TableRoutes from './admin/TableRoutes';
import StaffRoutes from './admin/StaffRoutes';
import CustomerRoutes from './admin/CustomerRoutes';
import InvoiceRoutes from './admin/InvoiceRoutes';
import InventoryRoutes from './admin/InventoryRoutes';
import MarketingRoutes from './admin/MarketingRoutes';
import SettingsRoutes from './admin/SettingsRoutes';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Render the routes by spreading them inside the Routes component */}
      <DashboardRoutes />
      <MenuRoutes />
      <OrderRoutes />
      <QRCodeRoutes />
      <TableRoutes />
      <StaffRoutes />
      <CustomerRoutes />
      <InventoryRoutes />
      <InvoiceRoutes />
      <MarketingRoutes />
      <SettingsRoutes />
    </Routes>
  );
};

export default AdminRoutes;
