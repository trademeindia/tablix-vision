
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRestaurantInvoices, getInvoiceById } from '@/services/invoice';
import { Invoice } from '@/services/invoice/types';
import { toast } from '@/hooks/use-toast';

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
