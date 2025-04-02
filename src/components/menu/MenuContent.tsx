
import React from 'react';
import LoadingSpinner from '@/components/menu/LoadingSpinner';
import MenuContentTabs from '@/components/menu/tabs/MenuContentTabs';
import { MenuCategory, MenuItem } from '@/types/menu';

interface MenuContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  categories: MenuCategory[];
  menuItems: MenuItem[];
  isCategoriesLoading: boolean;
  isItemsLoading: boolean;
  onAddCategory: () => void;
  onEditCategory: (category: MenuCategory) => void;
  onDeleteCategory: (category: MenuCategory) => void;
  onAddItem: () => void;
  onViewItem: (id: string) => void;
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (item: MenuItem) => void;
}

const MenuContent: React.FC<MenuContentProps> = (props) => {
  const { isCategoriesLoading, isItemsLoading } = props;

  if (isCategoriesLoading || isItemsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-background">
      <MenuContentTabs {...props} />
    </div>
  );
};

export default MenuContent;
