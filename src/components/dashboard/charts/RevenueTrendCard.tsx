
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronDown } from 'lucide-react';
import SalesChart from '@/components/analytics/SalesChart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RevenueTrendCardProps {
  salesData: Array<{name: string, total: number}>;
  salesDataLoading: boolean;
}

const RevenueTrendCard: React.FC<RevenueTrendCardProps> = ({ 
  salesData, 
  salesDataLoading 
}) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');
  
  const getTimeRangeLabel = () => {
    switch(timeRange) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'quarter': return 'This Quarter';
      default: return 'This Month';
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
