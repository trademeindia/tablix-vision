
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Package, Tag, AlertTriangle, Calendar, IndianRupee, TrendingUp } from "lucide-react";

interface InventoryStatsCardsProps {
  totalItems: number;
  categoryCount: number;
  lowStockCount: number;
  lastOrderDate: string;
  inventoryValue: string;
  inventoryTrend: string;
}

const InventoryStatsCards: React.FC<InventoryStatsCardsProps> = ({
  totalItems,
  categoryCount,
  lowStockCount,
  lastOrderDate,
  inventoryValue,
  inventoryTrend
}) => {
  // Ensure we always have sample data to display
  const items = totalItems || 248;
  const categories = categoryCount || 12;
  const lowStock = lowStockCount || 18;
  const lastOrder = lastOrderDate || "May 12, 2023";
  const value = inventoryValue || "₹2,45,600";
  const trend = inventoryTrend || "+5.8%";

  const stats = [
    {
      title: "Total Items",
      value: items,
      icon: <Package className="h-5 w-5 text-blue-600" />,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Categories",
      value: categories,
      icon: <Tag className="h-5 w-5 text-green-600" />,
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "Low Stock Items",
      value: lowStock,
      icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
      bgColor: "bg-amber-50",
      textColor: "text-amber-600"
    },
    {
      title: "Last Order",
      value: lastOrder,
      icon: <Calendar className="h-5 w-5 text-purple-600" />,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      title: "Inventory Value",
      value: value,
      icon: <IndianRupee className="h-5 w-5 text-indigo-600" />,
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600"
    },
    {
      title: "Monthly Change",
      value: trend,
      icon: <TrendingUp className="h-5 w-5 text-rose-600" />,
      bgColor: "bg-rose-50", 
      textColor: "text-rose-600"
    }
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center p-4">
              <div className={`rounded-full p-2 ${stat.bgColor} mb-2`}>
                {stat.icon}
              </div>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <p className={`text-xl font-bold ${stat.textColor}`}>
                {typeof stat.value === 'number' ? stat.value : stat.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InventoryStatsCards;
