
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import MenuCategoryCard from '@/components/menu/MenuCategoryCard';
import MenuItemCard from '@/components/menu/MenuItemCard';

// Dummy data
const categories = [
  { id: 'cat1', name: 'Appetizers', itemCount: 8 },
  { id: 'cat2', name: 'Main Courses', itemCount: 12 },
  { id: 'cat3', name: 'Pasta', itemCount: 6 },
  { id: 'cat4', name: 'Pizza', itemCount: 9 },
  { id: 'cat5', name: 'Desserts', itemCount: 5 },
  { id: 'cat6', name: 'Beverages', itemCount: 7 },
];

const menuItems = [
  {
    id: 'item1',
    name: 'Margherita Pizza',
    price: 12.99,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    isVegetarian: true,
  },
  {
    id: 'item2',
    name: 'Chicken Alfredo',
    price: 14.99,
    category: 'Pasta',
    image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
  {
    id: 'item3',
    name: 'Caesar Salad',
    price: 9.99,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    isVegetarian: true,
    isGlutenFree: true,
  },
  {
    id: 'item4',
    name: 'Chocolate Brownie',
    price: 6.99,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    isVegetarian: true,
  },
  {
    id: 'item5',
    name: 'Veggie Burger',
    price: 11.99,
    category: 'Main Courses',
    image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    isVegetarian: true,
    isVegan: true,
  },
  {
    id: 'item6',
    name: 'Iced Tea',
    price: 3.99,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1556679343-c1c4b8b4a125?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
  },
];

const MenuPage = () => {
  const [activeTab, setActiveTab] = useState('items');
  
  const handleCategoryEdit = (id: string) => {
    console.log('Edit category:', id);
  };
  
  const handleCategoryDelete = (id: string) => {
    console.log('Delete category:', id);
  };
  
  const handleItemView = (id: string) => {
    console.log('View item:', id);
  };
  
  const handleItemEdit = (id: string) => {
    console.log('Edit item:', id);
  };
  
  const handleItemDelete = (id: string) => {
    console.log('Delete item:', id);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Menu Management</h1>
          <p className="text-slate-500">Manage your restaurant's menu items and categories</p>
        </div>
        
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {activeTab === 'categories' ? 'Add Category' : 'Add Menu Item'}
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="items">Menu Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="items">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <MenuItemCard 
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                category={item.category}
                image={item.image}
                isVegetarian={item.isVegetarian}
                isVegan={item.isVegan}
                isGlutenFree={item.isGlutenFree}
                onView={handleItemView}
                onEdit={handleItemEdit}
                onDelete={handleItemDelete}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="categories">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <MenuCategoryCard 
                key={category.id}
                id={category.id}
                name={category.name}
                itemCount={category.itemCount}
                onEdit={handleCategoryEdit}
                onDelete={handleCategoryDelete}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default MenuPage;
