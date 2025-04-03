
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Customer } from '@/types/customer';
import { exportToCSV } from '@/utils/export';

interface CustomerExportProps {
  customers: Customer[];
}

const CustomerExport: React.FC<CustomerExportProps> = ({ customers }) => {
  const handleExport = () => {
    const headers = [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'visits', label: 'Visits' },
      { key: 'lastVisit', label: 'Last Visit' },
      { key: 'status', label: 'Status' },
      { key: 'loyaltyPoints', label: 'Loyalty Points' },
      { key: 'total_spent', label: 'Total Spent' },
      { key: 'address', label: 'Address' },
      { key: 'favorite_items', label: 'Favorite Items' },
      { key: 'notes', label: 'Notes' },
      { key: 'created_at', label: 'Customer Since' },
      { key: 'segment', label: 'Customer Segment' }
    ];

    // Prepare data for export - handle arrays and objects
    const preparedData = customers.map(customer => ({
      ...customer,
      favorite_items: customer.favorite_items?.join(', ') || '',
      preferences: undefined  // Remove complex objects that need special handling
    }));

    exportToCSV(preparedData, headers, 'customer-data.csv');
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="flex items-center gap-1" 
      onClick={handleExport}
    >
      <Download className="h-4 w-4" />
      <span>Export to CSV</span>
    </Button>
  );
};

export default CustomerExport;
