
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StaffOverview from '@/components/staff/StaffOverview';
import StaffList from '@/components/staff/StaffList';
import AddStaffDialog from '@/components/staff/AddStaffDialog';
import { useStaffData } from '@/hooks/use-staff-data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const StaffPage = () => {
  const { toast } = useToast();
  const [selectedView, setSelectedView] = useState<string>('all');
  const { staffData, isLoading, error, refetchStaff } = useStaffData();

  useEffect(() => {
    // Log that the staff page is loaded for debugging
    console.log('Staff page loaded');
  }, []);

  const handleStaffUpdated = () => {
    console.log('Staff updated, refreshing data...');
    refetchStaff();
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <p className="text-slate-500">Manage your restaurant staff members</p>
        </div>
        <AddStaffDialog onStaffAdded={refetchStaff} />
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was an error loading staff data. Using demo data instead.
          </AlertDescription>
        </Alert>
      )}
      
      <StaffOverview staffData={staffData} isLoading={isLoading} />
      
      <div className="mt-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Staff Members</CardTitle>
              <Tabs defaultValue="all" onValueChange={setSelectedView} className="w-auto">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <StaffList 
              staffData={staffData} 
              isLoading={isLoading} 
              filter={selectedView}
              onStaffUpdated={handleStaffUpdated}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StaffPage;
