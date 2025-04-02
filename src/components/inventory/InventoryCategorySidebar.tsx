
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

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
  getCategoryCount,
}) => {
  return (
    <Card className="md:col-span-1 h-fit">
      <CardHeader className="pb-3">
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-1">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant={selectedCategory === category.name ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onSelectCategory(category.name)}
            >
              <category.icon className="mr-2 h-4 w-4" />
              {category.name}
              <Badge className="ml-auto" variant="secondary">
                {getCategoryCount(category.name)}
              </Badge>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryCategorySidebar;
