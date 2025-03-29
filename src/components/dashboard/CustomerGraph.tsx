
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', new: 70, retained: 80 },
  { name: 'Feb', new: 130, retained: 100 },
  { name: 'Mar', new: 170, retained: 90 },
  { name: 'Apr', new: 160, retained: 110 },
  { name: 'May', new: 180, retained: 140 },
  { name: 'Jun', new: 190, retained: 170 },
  { name: 'Jul', new: 200, retained: 210 },
  { name: 'Aug', new: 170, retained: 240 },
  { name: 'Sep', new: 260, retained: 300 },
  { name: 'Oct', new: 230, retained: 280 },
  { name: 'Nov', new: 210, retained: 240 },
];

const CustomerGraph = () => {
  return (
    <Card className="h-full shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Customer Map</CardTitle>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-indigo-500 mr-1"></div>
            <span className="text-xs text-slate-500">New Client</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-pink-500 mr-1"></div>
            <span className="text-xs text-slate-500">Retained Client</span>
          </div>
          <div className="text-sm text-slate-500 flex items-center">
            This month <span className="ml-1">▼</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #E2E8F0', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="new" 
                stroke="#6366F1" 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 6, fill: '#6366F1' }} 
              />
              <Line 
                type="monotone" 
                dataKey="retained" 
                stroke="#EC4899" 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 6, fill: '#EC4899' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerGraph;
