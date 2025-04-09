
import React from 'react';
import PageHeader from '@/components/menu/PageHeader';

interface PageHeaderContainerProps {
  activeTab: string;
  onRefresh: () => void;
  isLoading: boolean;
}

const PageHeaderContainer: React.FC<PageHeaderContainerProps> = ({ 
  activeTab, 
  onRefresh, 
  isLoading 
}) => {
  const handleAdd = () => {
    // Use custom event to communicate with parent component
    const event = new CustomEvent('menu:add', { 
      detail: { type: activeTab === 'categories' ? 'category' : 'item' }
    });
    document.dispatchEvent(event);
  };

  return (
    <PageHeader 
      activeTab={activeTab}
      onRefresh={onRefresh}
      onAdd={handleAdd}
      isLoading={isLoading}
    />
  );
};

export default PageHeaderContainer;
