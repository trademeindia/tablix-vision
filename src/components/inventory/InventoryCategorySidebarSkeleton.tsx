
import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const InventoryCategorySidebarSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <div className="p-2">
        <h3 className="px-3 py-1 text-sm font-medium">Categories</h3>
        <div className="mt-1 space-y-1">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="px-3 py-2 flex items-center">
              <Skeleton className="h-4 w-4 mr-2" />
              <Skeleton className="h-4 w-24 flex-1" />
              <Skeleton className="h-4 w-6 rounded-full ml-2" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default InventoryCategorySidebarSkeleton;
