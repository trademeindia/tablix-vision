
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuCategories from '@/components/customer/menu/MenuCategories';
import MenuItems from '@/components/customer/menu/MenuItems';
import OrderSummary from '@/components/customer/menu/OrderSummary';
import { MenuItem } from '@/types/menu';

interface MenuContentProps {
  categories: any[];
  items: MenuItem[] | null;
  tableId: string;
  restaurantId: string;
  orderItems: Array<{item: MenuItem, quantity: number}>;
  onRemoveFromOrder: (itemId: string) => void;
  onAddToOrder: (item: MenuItem) => void;
}

const MenuContent: React.FC<MenuContentProps> = ({
  categories,
  items,
  tableId,
  restaurantId,
  orderItems,
  onRemoveFromOrder,
  onAddToOrder
}) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Set first category as selected by default when categories load
  useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);
  
  // Handle checkout navigation
  const handleCheckout = () => {
    // Store order items in localStorage for the checkout page
    localStorage.setItem('orderItems', JSON.stringify(orderItems));
    navigate(`/checkout?table=${tableId}&restaurant=${restaurantId}`);
  };
  
  return (
    <>
      <div className="mb-4 sticky top-16 bg-background z-10 pb-2 pt-4">
        <MenuCategories 
          categories={categories || []} 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />
      </div>
      
      <MenuItems 
        items={items?.filter(item => 
          selectedCategory ? item.category_id === selectedCategory : true
        ) || []} 
        onAddToOrder={onAddToOrder} 
      />
      
      {orderItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50">
          <OrderSummary 
            orderItems={orderItems} 
            onRemoveItem={onRemoveFromOrder} 
            onCheckout={handleCheckout}
          />
        </div>
      )}
    </>
  );
};

export default MenuContent;
