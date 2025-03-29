
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', value: 25 },
  { name: 'Tue', value: 40 },
  { name: 'Wed', value: 30 },
  { name: 'Thu', value: 15 },
  { name: 'Fri', value: 35 },
  { name: 'Sat', value: 25 },
  { name: 'Sun', value: 42 },
];

const OrderChart = () => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Order Chart</CardTitle>
        <div className="text-sm text-slate-500 flex items-center">
          Last 15 Days <span className="ml-1">▼</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar 
                dataKey="value" 
                fill="#6366F1" 
                radius={4}
                background={{ fill: '#F0F0F0', radius: 4 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderChart;
