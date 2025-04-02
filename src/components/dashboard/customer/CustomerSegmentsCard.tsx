
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

const CustomerSegmentsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md font-medium">Customer Segments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">New Customers</p>
              <p className="text-2xl font-bold">38%</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Returning Customers</p>
              <p className="text-2xl font-bold">62%</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <ArrowUpRight className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerSegmentsCard;
