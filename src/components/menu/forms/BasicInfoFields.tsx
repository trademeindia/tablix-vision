
import React, { useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { MenuCategory } from '@/types/menu';
import { UseFormReturn } from "react-hook-form";
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface BasicInfoFieldsProps {
  form: UseFormReturn<any>;
  categories: MenuCategory[];
  onRefreshCategories?: () => void;
}

const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({ 
  form, 
  categories,
  onRefreshCategories 
}) => {
  // Log categories to help with debugging
  // console.log("Categories in BasicInfoFields:", categories);
  
  // If there's no category selected and we have categories, select the first one
  useEffect(() => {
    const currentCategoryId = form.getValues('category_id');
    if (categories?.length > 0 && !currentCategoryId) {
      form.setValue('category_id', categories[0].id);
    }
  }, [categories, form]);
  
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Item name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Item description" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem className="relative">
              <div className="flex items-center justify-between">
                <FormLabel>Category</FormLabel>
                {onRefreshCategories && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={onRefreshCategories}
                    className="h-8 px-2"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Refresh
                  </Button>
                )}
              </div>
              <Select 
                onValueChange={field.onChange} 
                value={field.value || ''}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent 
                  position="popper" 
                  className="z-[100] w-full bg-background border shadow"
                >
                  {categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-4 text-center">
                      <p className="text-sm text-muted-foreground mb-2">No categories available</p>
                      <p className="text-xs text-muted-foreground">
                        Please create a category first or click refresh
                      </p>
                    </div>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="preparation_time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preparation Time (minutes)</FormLabel>
            <FormControl>
              <Input type="number" min="0" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default BasicInfoFields;
