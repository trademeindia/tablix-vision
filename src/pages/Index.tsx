
import React, { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageTransition from '@/components/ui/page-transition';
import DashboardContent from '@/components/dashboard/DashboardContent';

const Index = () => {
  // Add logging to track component render
  useEffect(() => {
    console.log("Index page rendered");
  }, []);

  return (
    <DashboardLayout>
      <PageTransition>
        <DashboardContent />
      </PageTransition>
    </DashboardLayout>
  );
};

export default Index;
