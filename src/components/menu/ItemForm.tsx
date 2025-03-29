
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MenuItem, MenuCategory } from '@/types/menu';
import { toast } from '@/hooks/use-toast';
import ModelUploader from './ModelUploader';
import { ExternalLink } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Item name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  price: z.coerce.number().min(0, {
    message: "Price must be a positive number.",
  }),
  category_id: z.string().min(1, {
    message: "Please select a category.",
  }),
  image_url: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  model_url: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  is_vegetarian: z.boolean().default(false),
  is_vegan: z.boolean().default(false),
  is_gluten_free: z.boolean().default(false),
  allergens: z.string().optional(),
  preparation_time: z.coerce.number().min(0).optional(),
  is_available: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  restaurant_id: z.string().optional(),
});

interface ItemFormProps {
  categories: MenuCategory[];
  initialData?: MenuItem;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

const ItemForm: React.FC<ItemFormProps> = ({
  categories,
  initialData,
  onSubmit,
  isSubmitting
}) => {
  const [mediaReference, setMediaReference] = useState(initialData?.media_reference || '');
  const [mediaUrl, setMediaUrl] = useState(initialData?.model_url || '');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      category_id: initialData?.category_id || "",
      image_url: initialData?.image_url || "",
      model_url: initialData?.model_url || "",
      is_vegetarian: initialData?.allergens?.isVegetarian || false,
      is_vegan: initialData?.allergens?.isVegan || false,
      is_gluten_free: initialData?.allergens?.isGlutenFree || false,
      allergens: initialData?.allergens?.items ? initialData.allergens.items.join(', ') : "",
      preparation_time: initialData?.preparation_time || 0,
      is_available: initialData?.is_available !== false,
      is_featured: initialData?.is_featured || false,
      restaurant_id: initialData?.restaurant_id || "",
    },
  });

  const handleModelUploadComplete = (fileId: string, fileUrl: string) => {
    setMediaReference(fileId);
    setMediaUrl(fileUrl);
    form.setValue('model_url', fileUrl);
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Process allergens to JSON format
      const formattedData = {
        ...values,
        allergens: {
          isVegetarian: values.is_vegetarian,
          isVegan: values.is_vegan,
          isGlutenFree: values.is_gluten_free,
          items: values.allergens ? values.allergens.split(',').map(item => item.trim()) : []
        },
        // Add model reference data if available
        ...(mediaReference && {
          media_reference: mediaReference,
          media_type: '3d'
        })
      };
      
      // Remove individual dietary flags as they're now in the allergens object
      delete formattedData.is_vegetarian;
      delete formattedData.is_vegan;
      delete formattedData.is_gluten_free;
      
      await onSubmit(formattedData);
      toast({
        title: initialData ? "Item updated" : "Item created",
        description: initialData ? "Your menu item has been updated successfully." : "Your menu item has been created successfully.",
      });
      
      if (!initialData) {
        form.reset();
        setMediaReference('');
        setMediaUrl('');
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="model_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>3D Model URL</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input placeholder="https://..." {...field} readOnly={!!mediaReference} />
                  </FormControl>
                  {field.value && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={() => window.open(field.value, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <FormDescription>
                  {mediaReference 
                    ? "A 3D model has been uploaded to Google Drive" 
                    : "Enter a URL or upload a 3D model below"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* 3D Model Uploader */}
        {initialData?.id && (
          <ModelUploader
            menuItemId={initialData.id}
            restaurantId={initialData.restaurant_id || form.getValues('restaurant_id')}
            onUploadComplete={handleModelUploadComplete}
            className="pt-2"
          />
        )}
        
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
        
        <div className="space-y-2">
          <h3 className="text-md font-medium">Dietary Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="is_vegetarian"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Vegetarian</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="is_vegan"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Vegan</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="is_gluten_free"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Gluten-Free</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="allergens"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allergens</FormLabel>
              <FormControl>
                <Input placeholder="e.g. peanuts, dairy, soy" {...field} />
              </FormControl>
              <FormDescription>
                Separate allergens with commas
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="is_available"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Available for ordering</FormLabel>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="is_featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Featured Item</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Update Item" : "Create Item"}
        </Button>
      </form>
    </Form>
  );
};

export default ItemForm;
