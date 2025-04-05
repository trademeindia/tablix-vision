
import React from 'react';
import StatsCard from '@/components/dashboard/StatsCard';
import { IndianRupee, ShoppingCart, CreditCard, Users } from 'lucide-react';

interface MonthlyMetricsProps {
  data: {
    revenue: string;
    orders: number;
    tables: string;
    newCustomers: number;
  };
}

const MonthlyMetrics: React.FC<MonthlyMetricsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
      <StatsCard 
        title="Monthly Revenue"
        value={data.revenue}
        icon={<IndianRupee className="h-5 w-5 text-green-600" />}
        trend={{ value: 18, isPositive: true }}
      />
      <StatsCard 
        title="Monthly Orders"
        value={data.orders}
        icon={<ShoppingCart className="h-5 w-5 text-blue-600" />}
        trend={{ value: 12, isPositive: true }}
      />
      <StatsCard 
        title="Tables Utilized"
        value={data.tables}
        icon={<CreditCard className="h-5 w-5 text-purple-600" />}
      />
      <StatsCard 
        title="New Customers"
        value={data.newCustomers}
        icon={<Users className="h-5 w-5 text-orange-600" />}
        trend={{ value: 30, isPositive: true }}
      />
    </div>
  );
};

export default MonthlyMetrics;
