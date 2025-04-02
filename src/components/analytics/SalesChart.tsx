
import React from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine 
} from 'recharts';

interface SalesChartProps {
  data: Array<{name: string, total: number}>;
  isLoading: boolean;
  currency?: string;
  height?: number;
  timeRange?: 'week' | 'month' | 'quarter';
}

const SalesChart: React.FC<SalesChartProps> = ({ 
  data, 
  isLoading,
  currency = 'USD',
  height = 300,
  timeRange = 'week'
}) => {
  // Format the date for display based on time range
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    
    if (timeRange === 'week') {
      // For weekly view, show day of week
      return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
    } else if (timeRange === 'month') {
      // For monthly view
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      // For quarterly view
      return date.toLocaleDateString('en-US', { month: 'short' });
    }
  };

  // Format the tooltip value as currency
  const formatCurrency = (value: number) => {
    // Handle special case for Indian Rupee
    if (currency === '₹' || currency === 'INR') {
      return `₹${value.toLocaleString('en-IN')}`;
    }
    
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
      }).format(value);
    } catch (error) {
      console.error('Error formatting currency:', error);
      // Fallback to simple formatting with the currency as prefix
      return `${currency}${value.toLocaleString()}`;
    }
  };

  // Calculate the average value for the reference line
  const calculateAverage = () => {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, curr) => acc + curr.total, 0);
    return sum / data.length;
  };
  
  const average = calculateAverage();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="font-medium">{formatDate(label)}</p>
          <p className="text-emerald-600 font-bold">
            {formatCurrency(payload[0].value)}
          </p>
          {payload[0].value > average ? (
            <p className="text-xs text-green-500">
              {Math.round((payload[0].value - average) / average * 100)}% above average
            </p>
          ) : (
            <p className="text-xs text-red-500">
              {Math.round((average - payload[0].value) / average * 100)}% below average
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Format Y-axis labels with appropriate currency symbol
  const formatYAxis = (value: number) => {
    if (currency === 'INR' || currency === '₹') {
      return `₹${value}`;
    }
    
    if (currency === 'USD') {
      return `$${value}`;
    }
    
    return `${currency} ${value}`;
  };

  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <CardTitle className="text-xl mb-4">Sales Trend</CardTitle>
        
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <Skeleton className="h-full w-full" />
          </div>
        ) : data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-slate-500">
            No data available
          </div>
        ) : (
          <div style={{ height: `${height}px` }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  tickFormatter={formatDate} 
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                  stroke="#94a3b8"
                />
                <YAxis 
                  tickFormatter={formatYAxis} 
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                  stroke="#94a3b8"
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine 
                  y={average} 
                  stroke="#94a3b8" 
                  strokeDasharray="3 3" 
                  label={{ 
                    value: "Avg", 
                    position: "insideTopRight",
                    fill: "#94a3b8",
                    fontSize: 10
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#10b981" 
                  fillOpacity={0.2}
                  fill="#10b981" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesChart;
