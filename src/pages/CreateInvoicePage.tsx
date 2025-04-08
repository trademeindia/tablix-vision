
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { createInvoice } from '@/services/invoice';
import { Invoice, InvoiceItem } from '@/services/invoice/types';
import InvoiceInfoSection from '@/components/invoice/create/InvoiceInfoSection';
import InvoiceItemsSection from '@/components/invoice/create/InvoiceItemsSection';
import InvoiceSummarySection from '@/components/invoice/create/InvoiceSummarySection';
import { supabase } from '@/integrations/supabase/client';

const CreateInvoicePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  // Mock restaurant data - in a real app, get this from context or API
  const restaurantData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Gourmet Delight Restaurant',
  };

  // Get current user ID on component mount
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Authentication error:', error);
        setError('Authentication error: Please log in to create invoices');
      } else if (data?.user) {
        setUserId(data.user.id);
      } else {
        setError('Authentication error: User not found');
      }
      
      setAuthChecked(true);
    };
    
    getCurrentUser();
  }, []);

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
    {
      name: '',
      description: '',
      quantity: 1,
      unit_price: 0,
      total_price: 0,
      tax_percentage: 5,
      discount_percentage: 0,
    },
  ]);

  // Calculate totals
  const [totals, setTotals] = useState({
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
  });

  // Update totals when items change
  useEffect(() => {
    const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);
    const tax = items.reduce(
      (sum, item) => sum + (item.total_price * (item.tax_percentage || 0)) / 100,
      0
    );
    const discount = items.reduce(
      (sum, item) => sum + (item.total_price * (item.discount_percentage || 0)) / 100,
      0
    );
    const total = subtotal + tax - discount;

    setTotals({ subtotal, tax, discount, total });
  }, [items]);

  // Handle invoice data changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoiceData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setInvoiceData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate form
    if (!invoiceData.customer_name) {
      toast({
        title: 'Missing Information',
        description: 'Please enter a customer name',
        variant: 'destructive',
      });
      return;
    }

    // Validate items
    const invalidItems = items.some(
      (item) => !item.name || item.quantity <= 0 || item.unit_price <= 0
    );
    if (invalidItems) {
      toast({
        title: 'Invalid Items',
        description: 'Please ensure all items have a name, quantity, and price',
        variant: 'destructive',
      });
      return;
    }

    if (!authChecked) {
      setError('Please wait while we verify your account');
      return;
    }

    if (!userId) {
      setError('Authentication error: You must be logged in to create an invoice');
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to create an invoice',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { invoice, error: invoiceError } = await createInvoice(
        {
          ...invoiceData,
          restaurant_id: restaurantData.id,
          total_amount: totals.subtotal,
          tax_amount: totals.tax,
          discount_amount: totals.discount,
          final_amount: totals.total,
          user_id: userId // Ensure user_id is passed
        },
        items
      );

      if (invoice) {
        toast({
          title: 'Success',
          description: 'Invoice created successfully',
        });

        // Navigate to the invoice page
        navigate(`/invoices/${invoice.id}`);
      } else {
        setError(invoiceError || 'Failed to create invoice. Please check your input and try again.');
        toast({
          title: 'Error',
          description: invoiceError || 'Failed to create invoice',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      const errorMessage = error?.message || 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
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

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!userId && authChecked && (
        <Alert variant="warning" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>You must be logged in to create invoices</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Invoice Information */}
          <InvoiceInfoSection
            invoiceData={invoiceData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
          />

          {/* Summary */}
          <InvoiceSummarySection totals={totals} isSubmitting={isSubmitting} />

          {/* Invoice Items */}
          <InvoiceItemsSection items={items} setItems={setItems} />
        </div>
      </form>
    </DashboardLayout>
  );
};

export default CreateInvoicePage;
