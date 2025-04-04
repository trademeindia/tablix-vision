
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageTransition from '@/components/ui/page-transition';
import DashboardContent from '@/components/dashboard/DashboardContent';

const Index = () => {
  return (
    <DashboardLayout>
      <PageTransition>
        <DashboardContent />
      </PageTransition>
    </DashboardLayout>
  );
};

export default Index;
