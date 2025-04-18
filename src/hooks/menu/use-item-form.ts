
import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MenuItem, MenuCategory } from '@/types/menu';
import { itemFormSchema, ItemFormValues } from '@/components/menu/forms/ItemFormSchema';
import { toast } from '@/hooks/use-toast';
import { createMenuItem } from '@/services/menu';

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
    const extension = fileUrl?.split('.').pop()?.toLowerCase();
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif'];
    const modelTypes = ['glb', 'gltf'];

    if (extension && imageTypes.includes(extension)) {
      // It's an image/gif
      setMediaReference(fileId); // Use fileId as reference for images too
      setMediaUrl(''); // Clear 3D model URL
      form.setValue('image_url', fileUrl);
      form.setValue('media_type', 'image');
      form.setValue('model_url', ''); // Clear model URL
      form.setValue('media_reference', fileId);
      console.log('Image upload handled:', fileUrl);
    } else if (extension && modelTypes.includes(extension)) {
      // It's a 3D model
      setMediaReference(fileId);
      setMediaUrl(fileUrl);
      form.setValue('model_url', fileUrl);
      form.setValue('media_type', '3d');
      form.setValue('media_reference', fileId);
      form.setValue('image_url', ''); // Clear image URL if any
      console.log('3D Model upload handled:', fileUrl, fileId);
    } else {
      // Unknown type or error
      console.warn('Unknown file type uploaded:', fileUrl);
      // Optionally show an error toast
      toast({
        title: "Unsupported File Type",
        description: "The uploaded file type is not supported. Please use JPG, PNG, GIF, GLB, or GLTF.",
        variant: "destructive",
      });
    }
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
      // For security reasons, it's better to create a new clean object
      // rather than passing the form values directly
      const menuItemData = {
        name: values.name,
        description: values.description,
        price: values.price,
        category_id: values.category_id,
        image_url: values.image_url,
        model_url: values.model_url,
        media_type: values.media_type,
        media_reference: values.media_reference,
        preparation_time: values.preparation_time,
        is_available: values.is_available,
        is_featured: values.is_featured,
        restaurant_id: values.restaurant_id,
        allergens: {
          isVegetarian: values.is_vegetarian,
          isVegan: values.is_vegan,
          isGlutenFree: values.is_gluten_free,
          items: values.allergens ? values.allergens.split(',').map(item => item.trim()) : []
        }
      };

      // Use createMenuItem directly from the service
      console.log("Submitting menu item data:", menuItemData);
      const result = await createMenuItem(menuItemData);
      
      await onSubmit(result);
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast({
        title: "Failed to create menu item",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      isSubmitting.current = false;
      console.log(`Form ${formId.current} submission complete`);
    }
  }, [onSubmit]);

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
