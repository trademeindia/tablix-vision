
import * as z from "zod";

export const itemFormSchema = z.object({
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

export type ItemFormValues = z.infer<typeof itemFormSchema>;
