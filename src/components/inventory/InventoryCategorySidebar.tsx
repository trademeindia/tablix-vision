
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface Category {
  name: string;
  icon: LucideIcon;
}

interface InventoryCategorySidebarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  getCategoryCount: (categoryName: string) => number;
}

const InventoryCategorySidebar: React.FC<InventoryCategorySidebarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  getCategoryCount
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-2">
        <h3 className="px-3 py-1 text-sm font-medium">Categories</h3>
        <div className="mt-1 space-y-1">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.name;
            const count = getCategoryCount(category.name);
            
            return (
              <Button
                key={category.name}
                variant="ghost"
                className={cn(
                  "w-full justify-start px-3",
                  isActive && "bg-accent text-accent-foreground"
                )}
                onClick={() => onSelectCategory(category.name)}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span className="flex-1 text-left">{category.name}</span>
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs tabular-nums">
                  {count}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default InventoryCategorySidebar;
