
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { createInvoice } from '@/services/invoice';
import { Invoice, InvoiceItem } from '@/services/invoice/types';
import { Plus, Trash2, ArrowLeft, Save } from 'lucide-react';

const CreateInvoicePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock restaurant data - in a real app, get this from context or API
  const restaurantData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Gourmet Delight Restaurant',
  };
  
  // Invoice form state
  const [invoiceData, setInvoiceData] = useState({
    customer_name: '',
    customer_id: '',
    order_id: '',
    status: 'draft' as Invoice['status'],
    notes: '',
    payment_method: '',
    payment_reference: '',
  });
  
  // Invoice items state
  const [items, setItems] = useState<Array<Omit<InvoiceItem, 'id' | 'invoice_id'>>>([
    { name: '', description: '', quantity: 1, unit_price: 0, total_price: 0, tax_percentage: 5, discount_percentage: 0 }
  ]);
  
  // Calculate totals
  const [totals, setTotals] = useState({
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0
  });
  
  // Update totals when items change
  useEffect(() => {
    const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);
    const tax = items.reduce((sum, item) => sum + (item.total_price * (item.tax_percentage || 0) / 100), 0);
    const discount = items.reduce((sum, item) => sum + (item.total_price * (item.discount_percentage || 0) / 100), 0);
    const total = subtotal + tax - discount;
    
    setTotals({ subtotal, tax, discount, total });
  }, [items]);
  
  // Handle invoice data changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setInvoiceData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle item changes
  const handleItemChange = (index: number, field: keyof Omit<InvoiceItem, 'id' | 'invoice_id'>, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Recalculate total price if quantity or unit price changes
    if (field === 'quantity' || field === 'unit_price') {
      const quantity = field === 'quantity' ? Number(value) : newItems[index].quantity;
      const unitPrice = field === 'unit_price' ? Number(value) : newItems[index].unit_price;
      newItems[index].total_price = quantity * unitPrice;
    }
    
    setItems(newItems);
  };
  
  // Add a new item
  const addItem = () => {
    setItems([...items, { name: '', description: '', quantity: 1, unit_price: 0, total_price: 0, tax_percentage: 5, discount_percentage: 0 }]);
  };
  
  // Remove an item
  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    } else {
      toast({
        title: "Cannot Remove",
        description: "At least one item is required",
        variant: "destructive",
      });
    }
  };
  
  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!invoiceData.customer_name) {
      toast({
        title: "Missing Information",
        description: "Please enter a customer name",
        variant: "destructive",
      });
      return;
    }
    
    // Validate items
    const invalidItems = items.some(item => !item.name || item.quantity <= 0 || item.unit_price <= 0);
    if (invalidItems) {
      toast({
        title: "Invalid Items",
        description: "Please ensure all items have a name, quantity, and price",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const invoice = await createInvoice(
        {
          ...invoiceData,
          restaurant_id: restaurantData.id,
          total_amount: totals.subtotal,
          tax_amount: totals.tax,
          discount_amount: totals.discount,
          final_amount: totals.total,
        },
        items
      );
      
      if (invoice) {
        toast({
          title: "Success",
          description: "Invoice created successfully",
        });
        
        // Navigate to the invoice page
        navigate(`/invoices/${invoice.id}`);
      } else {
        toast({
          title: "Error",
          description: "Failed to create invoice",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/invoices')} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Invoices
        </Button>
        <h1 className="text-2xl font-bold">Create New Invoice</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Invoice Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Invoice Information</CardTitle>
              <CardDescription>Enter the invoice details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer_name">Customer Name *</Label>
                  <Input
                    id="customer_name"
                    name="customer_name"
                    value={invoiceData.customer_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer_id">Customer ID (optional)</Label>
                  <Input
                    id="customer_id"
                    name="customer_id"
                    value={invoiceData.customer_id}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="order_id">Related Order ID (optional)</Label>
                  <Input
                    id="order_id"
                    name="order_id"
                    value={invoiceData.order_id}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={invoiceData.status}
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="issued">Issued</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {invoiceData.status === 'paid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment_method">Payment Method</Label>
                    <Select
                      value={invoiceData.payment_method}
                      onValueChange={(value) => handleSelectChange('payment_method', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="debit_card">Debit Card</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="online">Online Payment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment_reference">Payment Reference</Label>
                    <Input
                      id="payment_reference"
                      name="payment_reference"
                      value={invoiceData.payment_reference}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={invoiceData.notes}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${totals.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>-${totals.discount.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${totals.total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Creating Invoice...</>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Invoice
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Invoice Items */}
          <Card className="lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Invoice Items</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Table header */}
                <div className="grid grid-cols-12 gap-2 font-medium text-sm pb-2 border-b">
                  <div className="col-span-4">Item</div>
                  <div className="col-span-2">Quantity</div>
                  <div className="col-span-2">Unit Price</div>
                  <div className="col-span-2">Tax %</div>
                  <div className="col-span-1">Discount %</div>
                  <div className="col-span-1"></div>
                </div>
                
                {/* Items */}
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-4 space-y-2">
                      <Input
                        placeholder="Item name"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        required
                      />
                      <Input
                        placeholder="Description (optional)"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => handleItemChange(index, 'unit_price', Number(e.target.value))}
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        value={item.tax_percentage}
                        onChange={(e) => handleItemChange(index, 'tax_percentage', Number(e.target.value))}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        value={item.discount_percentage}
                        onChange={(e) => handleItemChange(index, 'discount_percentage', Number(e.target.value))}
                      />
                    </div>
                    <div className="col-span-1 text-right">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default CreateInvoicePage;
