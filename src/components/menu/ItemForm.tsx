import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { MenuItem, MenuCategory } from '@/types/menu';
import { toast } from '@/hooks/use-toast';
import { itemFormSchema, ItemFormValues } from './forms/ItemFormSchema';
import BasicInfoFields from './forms/BasicInfoFields';
import MediaFields from './forms/MediaFields';
import DietaryFields from './forms/DietaryFields';
import AvailabilityFields from './forms/AvailabilityFields';

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
  
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
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
      media_type: initialData?.media_type || "",
      media_reference: initialData?.media_reference || "",
    },
  });

  const handleModelUploadComplete = (fileId: string, fileUrl: string) => {
    setMediaReference(fileId);
    setMediaUrl(fileUrl);
    form.setValue('model_url', fileUrl);
    form.setValue('media_type', '3d');
    form.setValue('media_reference', fileId);
  };

  const handleSubmit = async (values: ItemFormValues) => {
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
        // Keep media data
        media_type: values.media_type || (mediaReference ? '3d' : ''),
        media_reference: values.media_reference || mediaReference
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
      console.error("Form submission error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <BasicInfoFields form={form} categories={categories} />
        
        <MediaFields 
          form={form} 
          mediaReference={mediaReference} 
          mediaUrl={mediaUrl} 
          menuItemId={initialData?.id}
          restaurantId={initialData?.restaurant_id || form.getValues('restaurant_id')}
          onUploadComplete={handleModelUploadComplete}
        />
        
        <DietaryFields form={form} />
        
        <AvailabilityFields form={form} />
        
        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
          {isSubmitting ? "Saving..." : initialData ? "Update Item" : "Create Item"}
        </Button>
      </form>
    </Form>
  );
};

export default ItemForm;
