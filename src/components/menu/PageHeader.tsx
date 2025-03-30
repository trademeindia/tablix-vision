
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';

interface PageHeaderProps {
  activeTab: string;
  onRefresh: () => void;
  onAdd: () => void;
  isLoading: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  activeTab, 
  onRefresh, 
  onAdd, 
  isLoading 
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold">Menu Management</h1>
        <p className="text-slate-500">Manage your restaurant's menu items and categories</p>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onRefresh} 
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          {activeTab === 'categories' ? 'Add Category' : 'Add Menu Item'}
        </Button>
      </div>
    </div>
  );
};

export default PageHeader;
