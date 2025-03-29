
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TrendingItem {
  id: number;
  name: string;
  price: string;
  orders: string;
  rank: string;
  image: string;
}

const trendingItems: TrendingItem[] = [
  {
    id: 1,
    name: 'Spicy cheesy Burger (small)',
    price: '$3.8',
    orders: 'Order 89x',
    rank: '#1',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 2,
    name: 'Sweet cheesy pizza for kids Meal (small)',
    price: '$5.6',
    orders: 'Order 37x',
    rank: '#2',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 3,
    name: 'Sweet cheesy pizza for kids Meal (Medium)',
    price: '$7.2',
    orders: 'Order 24x',
    rank: '#3',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  }
];

const TrendingItems = () => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Daily Trending Menus</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trendingItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.name}</p>
                <p className="text-sm text-orange-500 font-semibold">{item.price}</p>
              </div>
              
              <div className="text-right flex flex-col items-end">
                <span className="text-orange-500 font-medium">{item.rank}</span>
                <span className="text-xs text-slate-500">{item.orders}</span>
              </div>
            </div>
          ))}
          <div className="pt-2">
            <button className="w-full text-blue-500 text-sm hover:underline">View All</button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingItems;
