
import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MenuItem, MenuCategory } from '@/types/menu';
import { itemFormSchema, ItemFormValues } from '@/components/menu/forms/ItemFormSchema';

export const useItemForm = (
  initialData?: MenuItem,
  categories?: MenuCategory[],
  onSubmit?: (data: any) => Promise<void>
) => {
  const [mediaReference, setMediaReference] = useState(initialData?.media_reference || '');
  const [mediaUrl, setMediaUrl] = useState(initialData?.model_url || '');
  const isSubmitting = useRef(false);
  
  // Check if initialData.media_type is a valid value ('image' or '3d')
  const initialMediaType = initialData?.media_type === 'image' || initialData?.media_type === '3d' 
    ? initialData.media_type 
    : undefined;
    
  // Create unique IDs for this form instance to prevent confusion with other forms
  const formId = useRef(`form-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  
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
      media_type: initialMediaType,
      media_reference: initialData?.media_reference || "",
    },
  });

  // Update field if categories change and current category_id isn't valid
  useEffect(() => {
    if (!categories || categories.length === 0) return;
    
    const currentCategoryId = form.getValues('category_id');
    if (currentCategoryId) {
      const categoryExists = categories.some(cat => cat.id === currentCategoryId);
      if (!categoryExists) {
        // Set to first available category if current one doesn't exist
        form.setValue('category_id', categories[0].id);
      }
    } else {
      // Set default category if none selected
      form.setValue('category_id', categories[0].id);
    }
  }, [categories, form]);

  const handleModelUploadComplete = useCallback((fileId: string, fileUrl: string) => {
    setMediaReference(fileId);
    setMediaUrl(fileUrl);
    form.setValue('model_url', fileUrl);
    form.setValue('media_type', '3d');
    form.setValue('media_reference', fileId);
  }, [form]);

  const handleFormSubmit = useCallback(async (values: ItemFormValues) => {
    if (!onSubmit) return;
    
    // Prevent duplicate submissions
    if (isSubmitting.current) {
      console.log("Already submitting form, preventing duplicate submission");
      return;
    }
    
    isSubmitting.current = true;
    console.log(`Form ${formId.current} submitting...`);
    
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
        // Handle media data
        media_type: values.media_type || (mediaReference ? '3d' : values.image_url ? 'image' : undefined),
        media_reference: values.media_reference || mediaReference
      };
      
      // Remove individual dietary flags as they're now in the allergens object
      delete formattedData.is_vegetarian;
      delete formattedData.is_vegan;
      delete formattedData.is_gluten_free;
      
      await onSubmit(formattedData);
    } finally {
      isSubmitting.current = false;
      console.log(`Form ${formId.current} submission complete`);
    }
  }, [onSubmit, mediaReference]);

  return {
    form,
    mediaReference,
    mediaUrl,
    handleModelUploadComplete,
    handleFormSubmit,
    resetForm: useCallback(() => {
      form.reset();
      setMediaReference('');
      setMediaUrl('');
    }, [form])
  };
};
