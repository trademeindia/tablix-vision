
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { createOrder } from '@/services/order';
import { toast } from '@/hooks/use-toast';
import { EmptyPlate } from '@/components/ui/empty-plate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Form schema
const orderFormSchema = z.object({
  table_number: z.string().min(1, { message: 'Table number is required' }),
  customer_name: z.string().optional(),
  customer_email: z.string().email({ message: 'Invalid email' }).optional().or(z.literal('')),
  notes: z.string().optional(),
  items: z.array(z.object({
    name: z.string().min(1),
    price: z.number().min(0),
    quantity: z.number().min(1),
  })).optional(),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

const OrderFormPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Mock restaurant ID - in a real app, get this from context or API
  const restaurantId = '123e4567-e89b-12d3-a456-426614174000';

  // Form definition
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      table_number: '',
      customer_name: '',
      customer_email: '',
      notes: '',
      items: [
        { name: 'Margherita Pizza', price: 350, quantity: 1 },
        { name: 'Garlic Bread', price: 150, quantity: 2 }
      ],
    },
  });

  // Submit handler
  const onSubmit = async (data: OrderFormValues) => {
    setIsSubmitting(true);
    try {
      // Calculate total amount
      const totalAmount = data.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
      
      // Create order
      const order = await createOrder({
        restaurant_id: restaurantId,
        table_number: data.table_number,
        total_amount: totalAmount,
        notes: data.notes,
        items: data.items?.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })) || [],
      });
      
      if (order) {
        toast({
          title: "Order Created",
          description: "The order has been created successfully.",
        });
        navigate("/orders");
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  // Add and remove item handlers
  const addItem = () => {
    const currentItems = form.getValues('items') || [];
    form.setValue('items', [...currentItems, { name: '', price: 0, quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    const currentItems = form.getValues('items') || [];
    form.setValue('items', currentItems.filter((_, i) => i !== index));
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Order</h1>
          <p className="text-muted-foreground">Create a new order for your restaurant.</p>
        </div>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Order Information</CardTitle>
          <CardDescription>Fill in the order details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="table_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Table Number*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. T1, T2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customer_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Customer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customer_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="customer@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Special instructions..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <h3 className="font-medium text-lg mb-3">Order Items</h3>
                {form.getValues('items')?.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-lg">
                    <EmptyPlate className="h-12 w-12 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No items added to this order</p>
                    <Button type="button" variant="outline" onClick={addItem} className="mt-4">
                      Add First Item
                    </Button>
                  </div>
                )}
                
                <div className="space-y-3">
                  {form.getValues('items')?.map((_, index) => (
                    <div key={index} className="flex gap-3 items-end">
                      <FormField
                        control={form.control}
                        name={`items.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Item Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.price`}
                        render={({ field }) => (
                          <FormItem className="w-24">
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem className="w-24">
                            <FormLabel>Qty</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                min={1}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        onClick={() => removeItem(index)}
                        className="mb-0"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
                
                {form.getValues('items')?.length > 0 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addItem} 
                    className="mt-3"
                  >
                    Add Another Item
                  </Button>
                )}
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/orders')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Order'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default OrderFormPage;
