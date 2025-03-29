
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import RecentOrders from '@/components/dashboard/RecentOrders';
import PopularItems from '@/components/dashboard/PopularItems';
import CustomerGraph from '@/components/dashboard/CustomerGraph';
import OrderStats from '@/components/dashboard/OrderStats';
import TrendingItems from '@/components/dashboard/TrendingItems';
import LiveOrderManagement from '@/components/dashboard/LiveOrderManagement';
import OrderChart from '@/components/dashboard/OrderChart';
import MostSellingItems from '@/components/dashboard/MostSellingItems';
import { ShoppingCart, Users, Utensils, DollarSign } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  return (
    <DashboardLayout>
      <div className="mb-2">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-slate-500">Your daily dashboard report is here.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard 
          title="Total Revenue"
          value="$96,351"
          subtext="Total Revenue"
          icon={<DollarSign className="h-5 w-5 text-orange-500" />}
          bgColor="bg-orange-50"
          iconBgColor="bg-orange-100"
        />
        <StatsCard 
          title="54"
          value="54"
          subtext="Total Menus"
          icon={<Utensils className="h-5 w-5 text-orange-500" />}
          bgColor="bg-orange-50"
          iconBgColor="bg-orange-100"
        />
        <StatsCard 
          title="6898k"
          value="6898k"
          subtext="Total Customers"
          icon={<Users className="h-5 w-5 text-orange-500" />}
          bgColor="bg-orange-50"
          iconBgColor="bg-orange-100"
        />
        <StatsCard 
          title="22365"
          value="22365"
          subtext="Total Orders"
          icon={<ShoppingCart className="h-5 w-5 text-orange-500" />}
          bgColor="bg-orange-50"
          iconBgColor="bg-orange-100"
        />
        <div className="md:col-span-4">
          <Card className="overflow-hidden h-40 bg-gradient-to-r from-orange-400 to-red-500 text-white">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold mb-2">Today's Best Deal</h3>
                <button className="bg-black text-white px-4 py-2 rounded-md text-sm">View More</button>
              </div>
              <div>
                <img 
                  src="/lovable-uploads/b9a019e4-fdb1-4304-a1ec-ea90c54c92f0.png" 
                  alt="Today's Special" 
                  className="h-32 w-auto object-cover rounded-lg"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <CustomerGraph />
        </div>
        <div className="lg:col-span-1">
          <OrderStats />
        </div>
        <div className="lg:col-span-1">
          <TrendingItems />
        </div>
      </div>
      
      <div className="mb-6">
        <LiveOrderManagement />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <OrderChart />
        </div>
        <div className="lg:col-span-1">
          <MostSellingItems />
        </div>
        <div className="lg:col-span-1">
          <PopularItems />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
