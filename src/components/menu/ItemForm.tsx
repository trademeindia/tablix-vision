
import React, { useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { MenuItem, MenuCategory } from '@/types/menu';
import { toast } from '@/hooks/use-toast';
import { ItemFormValues } from './forms/ItemFormSchema';
import BasicInfoFields from './forms/BasicInfoFields';
import MediaFields from './forms/MediaFields';
import DietaryFields from './forms/DietaryFields';
import AvailabilityFields from './forms/AvailabilityFields';
import { useItemForm } from '@/hooks/menu/use-item-form';

interface ItemFormProps {
  categories: MenuCategory[];
  initialData?: MenuItem;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
  onRefreshCategories?: () => void;
}

const ItemForm: React.FC<ItemFormProps> = ({
  categories,
  initialData,
  onSubmit,
  isSubmitting,
  onRefreshCategories
}) => {
  const { 
    form, 
    mediaReference, 
    mediaUrl, 
    handleModelUploadComplete, 
    handleFormSubmit,
    resetForm 
  } = useItemForm(initialData, categories, async (data) => {
    try {
      // Prevent accidental form resubmission
      if (isSubmitting) {
        // console.log("Already submitting, preventing duplicate submission");
        return;
      }
      
      await onSubmit(data);
      
      toast({
        title: initialData ? "Item updated" : "Item created",
        description: initialData ? "Your menu item has been updated successfully." : "Your menu item has been created successfully.",
      });
      
      if (!initialData) {
        resetForm();
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    form.handleSubmit(handleFormSubmit)(event);
  }, [form, handleFormSubmit]);
  
  return (
    <Form {...form}>
      <form 
        onSubmit={handleSubmit} 
        className="space-y-8" 
        onClick={(e) => e.stopPropagation()}
      >
        <BasicInfoFields 
          form={form} 
          categories={categories} 
          onRefreshCategories={onRefreshCategories}
        />
        
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
        
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full md:w-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {isSubmitting ? "Saving..." : initialData ? "Update Item" : "Create Item"}
        </Button>
      </form>
    </Form>
  );
};

export default React.memo(ItemForm);
