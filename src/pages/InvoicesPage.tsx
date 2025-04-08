
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import InvoiceList from '@/components/invoice/InvoiceList';
import { Button } from '@/components/ui/button';
import { Plus, Database, RefreshCw } from 'lucide-react';
import { useInvoices } from '@/hooks/invoice/use-invoices';
import { useInvoiceActions } from '@/hooks/invoice/use-invoice-actions';
import InvoiceDialog from '@/components/invoice/list/InvoiceDialog';
import InvoiceStats from '@/components/invoice/InvoiceStats';
import { createSampleInvoices } from '@/services/invoice';
import { toast } from '@/hooks/use-toast';

const InvoicesPage = () => {
  const navigate = useNavigate();
  const [isGeneratingSamples, setIsGeneratingSamples] = useState(false);

  // Mock restaurant data - in a real app, get this from context or API
  const restaurantData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Gourmet Delight Restaurant',
    address: '123 Foodie Street, Culinary District, Flavortown',
  };

  const {
    invoices,
    setInvoices,
    selectedInvoice,
    setSelectedInvoice,
    isLoading,
    invoiceDialogOpen,
    setInvoiceDialogOpen,
    handleViewInvoice,
    handleCloseInvoiceDialog,
    refreshInvoices
  } = useInvoices(restaurantData.id);

  const {
    isSharing,
    handleUpdateStatus,
    handlePrintInvoice,
    handleDownloadAsPNG,
    handleDownloadAsPDF,
    handleShareInvoice,
    handleEmailInvoice
  } = useInvoiceActions(selectedInvoice, setSelectedInvoice, setInvoices, restaurantData.name);

  const handleCreateInvoice = () => {
    // Update to use the same path as defined in the routes
    navigate('/invoices/create');
  };

  const handleGenerateSampleInvoices = async () => {
    setIsGeneratingSamples(true);
    try {
      const success = await createSampleInvoices(restaurantData.id);
      if (success) {
        toast({
          title: 'Success',
          description: 'Sample invoices have been generated successfully',
        });
        // Refresh the invoice list
        await refreshInvoices();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to generate sample invoices',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error generating sample invoices:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingSamples(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-slate-500">Manage your restaurant invoices</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={refreshInvoices}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            onClick={handleGenerateSampleInvoices} 
            disabled={isGeneratingSamples}
          >
            <Database className="h-4 w-4 mr-2" />
            {isGeneratingSamples ? 'Generating...' : 'Generate Samples'}
          </Button>
          <Button onClick={handleCreateInvoice}>
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>
      
      {/* Invoice statistics section */}
      <div className="mb-6">
        <InvoiceStats invoices={invoices} isLoading={isLoading} />
      </div>
      
      <InvoiceList 
        invoices={invoices}
        onViewInvoice={handleViewInvoice}
        isLoading={isLoading}
      />
      
      {selectedInvoice && (
        <InvoiceDialog
          invoice={selectedInvoice}
          open={invoiceDialogOpen}
          onOpenChange={setInvoiceDialogOpen}
          restaurantName={restaurantData.name}
          restaurantAddress={restaurantData.address}
          onUpdateStatus={handleUpdateStatus}
          onPrint={handlePrintInvoice}
          onDownloadPNG={handleDownloadAsPNG}
          onDownloadPDF={handleDownloadAsPDF}
          onShare={handleShareInvoice}
          onEmail={handleEmailInvoice}
          isSharing={isSharing}
        />
      )}
    </DashboardLayout>
  );
};

export default InvoicesPage;
