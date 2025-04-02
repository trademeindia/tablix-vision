
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { InvoiceItem } from '@/services/invoice/types';
import { toast } from '@/hooks/use-toast';

interface InvoiceItemsSectionProps {
  items: Array<Omit<InvoiceItem, 'id' | 'invoice_id'>>;
  setItems: React.Dispatch<React.SetStateAction<Array<Omit<InvoiceItem, 'id' | 'invoice_id'>>>>;
}

const InvoiceItemsSection: React.FC<InvoiceItemsSectionProps> = ({ items, setItems }) => {
  // Add a new item
  const addItem = () => {
    setItems([
      ...items,
      {
        name: '',
        description: '',
        quantity: 1,
        unit_price: 0,
        total_price: 0,
        tax_percentage: 5,
        discount_percentage: 0,
      },
    ]);
  };

  // Remove an item
  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    } else {
      toast({
        title: 'Cannot Remove',
        description: 'At least one item is required',
        variant: 'destructive',
      });
    }
  };

  // Handle item changes
  const handleItemChange = (
    index: number,
    field: keyof Omit<InvoiceItem, 'id' | 'invoice_id'>,
    value: any
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Recalculate total price if quantity or unit price changes
    if (field === 'quantity' || field === 'unit_price') {
      const quantity = field === 'quantity' ? Number(value) : newItems[index].quantity;
      const unitPrice = field === 'unit_price' ? Number(value) : newItems[index].unit_price;
      newItems[index].total_price = quantity * unitPrice;
    }

    setItems(newItems);
  };

  return (
    <Card className="lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Invoice Items</CardTitle>
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-2 font-medium text-sm pb-2 border-b">
            <div className="col-span-4">Item</div>
            <div className="col-span-2">Quantity</div>
            <div className="col-span-2">Unit Price</div>
            <div className="col-span-2">Tax %</div>
            <div className="col-span-1">Discount %</div>
            <div className="col-span-1"></div>
          </div>

          {/* Items */}
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-4 space-y-2">
                <Input
                  placeholder="Item name"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  required
                />
                <Input
                  placeholder="Description (optional)"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  min="1"
                  step="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                  required
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unit_price}
                  onChange={(e) => handleItemChange(index, 'unit_price', Number(e.target.value))}
                  required
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={item.tax_percentage}
                  onChange={(e) => handleItemChange(index, 'tax_percentage', Number(e.target.value))}
                />
              </div>
              <div className="col-span-1">
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={item.discount_percentage}
                  onChange={(e) =>
                    handleItemChange(index, 'discount_percentage', Number(e.target.value))
                  }
                />
              </div>
              <div className="col-span-1 text-right">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceItemsSection;
