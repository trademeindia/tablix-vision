
import React from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface PeakHoursAnalysisProps {
  data: Array<{hour: string, orders: number, revenue: number}>;
  isLoading: boolean;
  currency?: string;
}

const PeakHoursAnalysis: React.FC<PeakHoursAnalysisProps> = ({ 
  data, 
  isLoading,
  currency = 'INR' 
}) => {
  // Format currency
  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">
            Orders: <span className="font-bold">{payload[0].value}</span>
          </p>
          <p className="text-green-600">
            Revenue: <span className="font-bold">{formatCurrency(payload[1].value)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <CardTitle className="text-xl mb-4">Peak Hours Analysis</CardTitle>
        
        {isLoading ? (
          <div className="h-[300px] w-full">
            <Skeleton className="h-full w-full" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-6 text-slate-500 h-[300px] flex items-center justify-center">
            No peak hours data available
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="hour" 
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                  stroke="#94a3b8"
                />
                <YAxis 
                  yAxisId="left"
                  orientation="left"
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                  stroke="#94a3b8"
                  label={{ value: 'Orders', angle: -90, position: 'insideLeft', offset: -15 }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value) => `₹${value/1000}K`} 
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                  stroke="#94a3b8"
                  label={{ value: 'Revenue', angle: 90, position: 'insideRight', offset: -15 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="orders" fill="#3b82f6" name="Orders" yAxisId="left" />
                <Bar dataKey="revenue" fill="#10b981" name="Revenue" yAxisId="right" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PeakHoursAnalysis;
