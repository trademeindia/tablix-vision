
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LucideIcon } from 'lucide-react';

interface Category {
  name: string;
  icon: LucideIcon;
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
  categories
}) => {
  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      name: '',
      category: '',
      quantity: '',
      unit: '',
      price: '',
      supplier: ''
    }
  });

  const onSubmit = (data: any) => {
    onAddItem(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Inventory Item</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name</Label>
              <Input 
                id="name" 
                {...register("name", { required: "Item name is required" })} 
                placeholder="Enter item name"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message?.toString()}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                onValueChange={(value) => setValue("category", value)}
                value={watch("category")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter(cat => cat.name !== "All")
                    .map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category.message?.toString()}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input 
                  id="quantity" 
                  type="number"
                  {...register("quantity", { 
                    required: "Quantity is required",
                    min: { value: 1, message: "Quantity must be at least 1" }
                  })} 
                  placeholder="0"
                />
                {errors.quantity && (
                  <p className="text-sm text-red-500">{errors.quantity.message?.toString()}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input 
                  id="unit" 
                  {...register("unit", { required: "Unit is required" })} 
                  placeholder="kg, liters, etc."
                />
                {errors.unit && (
                  <p className="text-sm text-red-500">{errors.unit.message?.toString()}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price per Unit ($)</Label>
              <Input 
                id="price" 
                type="number" 
                step="0.01"
                {...register("price", { 
                  required: "Price is required",
                  min: { value: 0.01, message: "Price must be greater than 0" }
                })} 
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message?.toString()}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Input 
                id="supplier" 
                {...register("supplier", { required: "Supplier is required" })} 
                placeholder="Enter supplier name"
              />
              {errors.supplier && (
                <p className="text-sm text-red-500">{errors.supplier.message?.toString()}</p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
