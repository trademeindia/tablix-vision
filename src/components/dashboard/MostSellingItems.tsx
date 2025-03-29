
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoreHorizontal } from 'lucide-react';

interface SellingItem {
  id: string;
  name: string;
  category: string;
  price: string;
  serves: string;
  image: string;
}

const sellingItems: SellingItem[] = [
  {
    id: '1',
    name: 'Hot & spicy cheezy pizza kids',
    category: 'Pizza',
    price: '$12.56',
    serves: 'Serves for 2 Person 6 min',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '2',
    name: '4 season cheezy pizza kids',
    category: 'Pizza',
    price: '$13.56',
    serves: 'Serves for 4 Person 6 min',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  }
];

const MostSellingItems = () => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Most Selling Items</CardTitle>
        <div className="text-sm text-slate-500 flex items-center">
          Today <span className="ml-1">▼</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sellingItems.map((item) => (
            <div key={item.id} className="border border-slate-200 rounded-lg p-3">
              <div className="flex items-start space-x-3">
                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between w-full">
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.category}</p>
                    </div>
                    <MoreHorizontal className="h-5 w-5 text-slate-400" />
                  </div>
                  <p className="text-sm font-semibold mt-1">{item.price}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.serves}</p>
                  <div className="flex mt-2 space-x-2">
                    <button className="text-xs px-2 py-1 bg-slate-100 rounded-md text-slate-600">Edit item</button>
                    <button className="text-xs px-2 py-1 bg-slate-100 rounded-md text-slate-600">Delete item</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">Displaying 2 out of 26</p>
            <button className="text-blue-500 text-sm hover:underline mt-1">View All »</button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MostSellingItems;
