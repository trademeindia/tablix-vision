
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronDown } from 'lucide-react';
import SalesChart from '@/components/analytics/SalesChart';
import { useSalesData } from '@/hooks/analytics/use-sales-data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RevenueTrendCardProps {
  restaurantId?: string;
}

const RevenueTrendCard: React.FC<RevenueTrendCardProps> = ({ 
  restaurantId 
}) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('week');
  const { salesData, salesDataLoading } = useSalesData(restaurantId, timeRange);
  
  const getTimeRangeLabel = () => {
    switch(timeRange) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'quarter': return 'This Quarter';
      case 'year': return 'This Year';
      default: return 'This Week';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">Revenue Trend</CardTitle>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Calendar className="mr-2 h-4 w-4" />
                {getTimeRangeLabel()}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTimeRange('week')}>
                This Week
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange('month')}>
                This Month
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange('quarter')}>
                This Quarter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange('year')}>
                This Year
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <SalesChart 
          data={salesData} 
          isLoading={salesDataLoading}
          height={250}
          currency="INR"
          timeRange={timeRange}
        />
      </CardContent>
    </Card>
  );
};

export default RevenueTrendCard;
