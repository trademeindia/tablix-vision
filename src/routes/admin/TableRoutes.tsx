
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import TablesPage from '@/pages/TablesPage';

const TableRoutes = () => {
  return (
    <>
      <Route 
        path="/tables" 
        element={
          <ProtectedRoute requiredRoles={['owner', 'manager']}>
            <TablesPage />
          </ProtectedRoute>
        } 
      />
    </>
  );
};

export default TableRoutes;
