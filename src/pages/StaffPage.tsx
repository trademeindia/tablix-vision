
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
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Staff Management</h1>
          <p className="text-slate-500 mt-1">Manage your restaurant staff members</p>
        </div>
        <div className="mt-4 md:mt-0">
          <AddStaffDialog onStaffAdded={refetchStaff} />
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6 bg-red-50 border border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was an error loading staff data. Using demo data instead.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="mb-8 mt-4">
        <StaffOverview staffData={staffData} isLoading={isLoading} />
      </div>
      
      <div className="mt-8">
        <Card className="shadow-md border-slate-200">
          <CardHeader className="pb-2 bg-slate-50 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <CardTitle className="text-slate-800">Staff Members</CardTitle>
              <Tabs defaultValue="all" onValueChange={setSelectedView} className="w-auto mt-4 sm:mt-0">
                <TabsList className="bg-slate-200">
                  <TabsTrigger value="all" className="data-[state=active]:bg-white">All</TabsTrigger>
                  <TabsTrigger value="active" className="data-[state=active]:bg-white data-[state=active]:text-green-600">Active</TabsTrigger>
                  <TabsTrigger value="inactive" className="data-[state=active]:bg-white data-[state=active]:text-slate-600">Inactive</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="p-0 sm:p-4">
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
