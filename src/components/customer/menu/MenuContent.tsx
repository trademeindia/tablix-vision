
import React, { useState, useEffect, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuCategories from '@/components/customer/menu/MenuCategories';
import MenuItems from '@/components/customer/menu/MenuItems';
import OrderSummary from '@/components/customer/menu/OrderSummary';
import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react';
import { useLoyalty } from '@/hooks/use-loyalty';
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
  const { points } = useLoyalty();

  useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  const filteredItems = useMemo(() => {
    if (!items) return [];
    return selectedCategory 
      ? items.filter(item => item.category_id === selectedCategory)
      : items;
  }, [items, selectedCategory]);

  const handleCheckout = () => {
    localStorage.setItem('orderItems', JSON.stringify(orderItems));
    navigate(`/checkout?table=${tableId}&restaurant=${restaurantId}`, { 
      state: { fromMenu: true } 
    });
  };

  return (
    <div className="flex flex-col h-full">
      {points > 0 && (
        <div className="mb-4 flex items-center justify-between bg-primary/10 rounded-lg p-3">
          <div className="flex items-center">
            <Gift className="h-5 w-5 text-primary mr-2" />
            <span className="font-medium">You have {points} loyalty points</span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/profile?table=${tableId}&restaurant=${restaurantId}`)}
          >
            View
          </Button>
        </div>
      )}
      
      <div className="mb-4 sticky top-16 bg-background z-10 pb-2 pt-2">
        <MenuCategories 
          categories={categories || []} 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />
      </div>
      
      <div className="flex-grow overflow-auto pb-24">
        <MenuItems 
          items={filteredItems} 
          onAddToOrder={onAddToOrder} 
        />
      </div>
      
      {orderItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 pb-safe z-50">
          <OrderSummary 
            orderItems={orderItems} 
            onRemoveItem={onRemoveFromOrder}
            onAddItem={onAddToOrder}
            onCheckout={handleCheckout}
          />
        </div>
      )}
    </div>
  );
};

export default memo(MenuContent);
