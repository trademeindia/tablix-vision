
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MenuItem {
  name: string;
  category: string;
  orders: number;
  image: string;
}

const dummyItems: MenuItem[] = [
  {
    name: 'Margherita Pizza',
    category: 'Pizza',
    orders: 124,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    name: 'Chicken Alfredo',
    category: 'Pasta',
    orders: 98,
    image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    name: 'Caesar Salad',
    category: 'Salads',
    orders: 87,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    name: 'Chocolate Brownie',
    category: 'Desserts',
    orders: 76,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
];

const PopularItems = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Popular Menu Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dummyItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.name}</p>
                <p className="text-sm text-slate-500">{item.category}</p>
              </div>
              
              <div className="text-right">
                <p className="font-medium">{item.orders}</p>
                <p className="text-sm text-slate-500">orders</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PopularItems;
