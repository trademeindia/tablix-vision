
import React from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface AverageOrderValueProps {
  data: Array<{name: string, value: number}>;
  isLoading: boolean;
  currency?: string;
}

const AverageOrderValue = ({ 
  data, 
  isLoading,
  currency = 'INR'
}: AverageOrderValueProps) => {
  // Format date labels
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="font-medium">{formatDate(label)}</p>
          <p className="text-blue-600 font-bold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <CardTitle className="text-xl mb-4">Average Order Value</CardTitle>
        
        {isLoading ? (
          <div className="h-[300px] w-full">
            <Skeleton className="h-full w-full" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-6 text-slate-500 h-[300px] flex items-center justify-center">
            No average order data available
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
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
                  tickFormatter={(value) => formatCurrency(value)} 
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                  stroke="#94a3b8"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6, fill: '#2563eb' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AverageOrderValue;
