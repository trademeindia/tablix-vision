
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageTransition from '@/components/ui/page-transition';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { Helmet } from 'react-helmet-async';

const DashboardPage = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard | Menu 360</title>
      </Helmet>
      <DashboardLayout>
        <PageTransition>
          <DashboardContent />
        </PageTransition>
      </DashboardLayout>
    </>
  );
};

export default DashboardPage;
