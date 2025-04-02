
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import SalesChart from '@/components/analytics/SalesChart';

interface RevenueTrendCardProps {
  salesData: Array<{name: string, total: number}>;
  salesDataLoading: boolean;
}

const RevenueTrendCard: React.FC<RevenueTrendCardProps> = ({ 
  salesData, 
  salesDataLoading 
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">Revenue Trend</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="h-8">
            <Calendar className="mr-2 h-4 w-4" />
            This Month
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <SalesChart 
          data={salesData} 
          isLoading={salesDataLoading}
          height={250}
          currency="INR"
        />
      </CardContent>
    </Card>
  );
};

export default RevenueTrendCard;
