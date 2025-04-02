
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const InventoryCategorySidebarSkeleton: React.FC = () => {
  return (
    <Card className="md:col-span-1 h-fit">
      <CardHeader className="pb-3">
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-1">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i} 
              className="flex items-center justify-between p-2 h-10 rounded-md"
            >
              <div className="flex items-center">
                <Skeleton className="h-4 w-4 mr-2 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-5 w-8 rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryCategorySidebarSkeleton;
