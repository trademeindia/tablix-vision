
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Pizza (40%)', value: 40, color: '#F97316' },
  { name: 'Dessert (20%)', value: 20, color: '#8B5CF6' },
  { name: 'Juice (25%)', value: 25, color: '#22C55E' },
  { name: 'Burger (15%)', value: 15, color: '#3B82F6' },
];

const COLORS = ['#F97316', '#8B5CF6', '#22C55E', '#3B82F6'];

const PopularItems = () => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Popular Items</CardTitle>
        <div className="text-sm text-slate-500 flex items-center">
          Month <span className="ml-1">▼</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PopularItems;
