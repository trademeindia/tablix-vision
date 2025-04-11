
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import InvoicesPage from '@/pages/InvoicesPage';
import CreateInvoicePage from '@/pages/CreateInvoicePage';

const InvoiceRoutes = () => {
  return (
    <>
      <Route 
        path="/invoices" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <InvoicesPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/invoices/:invoiceId" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <InvoicesPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/invoices/create" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <CreateInvoicePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/create-invoice" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <CreateInvoicePage />
          </ProtectedRoute>
        } 
      />
    </>
  );
};

export default InvoiceRoutes;
