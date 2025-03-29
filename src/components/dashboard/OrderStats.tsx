
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OrderStats = () => {
  return (
    <Card className="h-full shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Purchases</CardTitle>
        <div className="text-sm text-slate-500 flex items-center">
          This month <span className="ml-1">▼</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-indigo-100 rounded-full">
                <div className="h-4 w-4 rounded-full bg-indigo-500"></div>
              </div>
              <div>
                <div className="text-sm font-medium">Orders</div>
                <div className="text-xs text-slate-500">Increased by 10%</div>
              </div>
              <div className="ml-auto text-lg font-semibold">$4,036.00</div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-indigo-400 to-indigo-600"></div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-pink-100 rounded-full">
                <div className="h-4 w-4 rounded-full bg-pink-500"></div>
              </div>
              <div>
                <div className="text-sm font-medium">Voucher Usage</div>
                <div className="text-xs text-slate-500">Increased by 8%</div>
              </div>
              <div className="ml-auto text-lg font-semibold">$896.78</div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-gradient-to-r from-pink-400 to-pink-600"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderStats;
