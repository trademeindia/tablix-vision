
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  name: string;
  icon: React.ElementType;
}

interface AddItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (formData: any) => void;
  categories: Category[];
}

const AddItemDialog: React.FC<AddItemDialogProps> = ({
  isOpen,
  onClose,
  onAddItem,
  categories,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Inventory Item</DialogTitle>
          <DialogDescription>
            Enter the details of the new inventory item.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          onAddItem({
            name: formData.get('name'),
            category: formData.get('category'),
            quantity: formData.get('quantity'),
            unit: formData.get('unit'),
            price: formData.get('price'),
            supplier: formData.get('supplier')
          });
        }}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">Item Name</label>
              <Input id="name" name="name" placeholder="Enter item name" required />
            </div>
            <div className="grid gap-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter(c => c.name !== "All").map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="quantity" className="text-sm font-medium">Quantity</label>
                <Input id="quantity" name="quantity" type="number" placeholder="0" min="1" required />
              </div>
              <div className="grid gap-2">
                <label htmlFor="unit" className="text-sm font-medium">Unit</label>
                <Select name="unit" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="liters">Liters</SelectItem>
                    <SelectItem value="units">Units</SelectItem>
                    <SelectItem value="bottles">Bottles</SelectItem>
                    <SelectItem value="boxes">Boxes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="price" className="text-sm font-medium">Price per Unit ($)</label>
              <Input id="price" name="price" type="number" step="0.01" placeholder="0.00" min="0.01" required />
            </div>
            <div className="grid gap-2">
              <label htmlFor="supplier" className="text-sm font-medium">Supplier</label>
              <Input id="supplier" name="supplier" placeholder="Enter supplier name" required />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
