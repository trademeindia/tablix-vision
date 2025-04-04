
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const InventoryStatsCardsSkeleton = () => {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center p-4">
              <Skeleton className="h-9 w-9 rounded-full mb-2" />
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-7 w-10" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InventoryStatsCardsSkeleton;
