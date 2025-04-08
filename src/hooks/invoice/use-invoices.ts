
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRestaurantInvoices, getInvoiceById } from '@/services/invoice';
import { Invoice } from '@/services/invoice/types';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useInvoices = (restaurantId: string) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const { invoiceId } = useParams();
  const navigate = useNavigate();

  // Load invoices on component mount
  useEffect(() => {
    const fetchInvoices = async () => {
      setIsLoading(true);
      try {
        const data = await getRestaurantInvoices(restaurantId);
        setInvoices(data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        toast({
          title: 'Error',
          description: 'Failed to load invoices',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [restaurantId]);

  // Set up real-time listener for invoice changes
  useEffect(() => {
    // Set up a realtime subscription to invoices table
    const channel = supabase
      .channel('invoices-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'invoices',
          filter: `restaurant_id=eq.${restaurantId}`
        }, 
        async (payload) => {
          console.log('Realtime invoice update:', payload);
          
          // Refresh the invoice list when changes occur
          try {
            const updatedInvoices = await getRestaurantInvoices(restaurantId);
            setInvoices(updatedInvoices);
            
            // If the current selected invoice was updated, refresh it too
            if (selectedInvoice && payload.new.id === selectedInvoice.id) {
              const updatedInvoice = await getInvoiceById(selectedInvoice.id);
              if (updatedInvoice) {
                setSelectedInvoice(updatedInvoice);
              }
            }
          } catch (error) {
            console.error('Error refreshing invoices after update:', error);
          }
        }
      )
      .subscribe();

    return () => {
      // Clean up the subscription when component unmounts
      supabase.removeChannel(channel);
    };
  }, [restaurantId, selectedInvoice]);

  // If invoiceId param exists, load that specific invoice
  useEffect(() => {
    if (invoiceId) {
      const fetchInvoice = async () => {
        try {
          const invoice = await getInvoiceById(invoiceId);
          if (invoice) {
            setSelectedInvoice(invoice);
            setInvoiceDialogOpen(true);
          } else {
            toast({
              title: 'Error',
              description: 'Invoice not found',
              variant: 'destructive',
            });
            navigate('/invoices');
          }
        } catch (error) {
          console.error('Error fetching invoice details:', error);
          toast({
            title: 'Error',
            description: 'Failed to load invoice details',
            variant: 'destructive',
          });
        }
      };

      fetchInvoice();
    }
  }, [invoiceId, navigate]);

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setInvoiceDialogOpen(true);
    navigate(`/invoices/${invoice.id}`, { replace: true });
  };

  const handleCloseInvoiceDialog = () => {
    setInvoiceDialogOpen(false);
    setSelectedInvoice(null);
    navigate('/invoices', { replace: true });
  };

  return {
    invoices,
    setInvoices,
    selectedInvoice,
    setSelectedInvoice,
    isLoading,
    invoiceDialogOpen,
    setInvoiceDialogOpen,
    handleViewInvoice,
    handleCloseInvoiceDialog
  };
};
