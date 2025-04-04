
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

type TableWithQR = {
  id: string;
  number: number;
  qr_code_url: string;
  status: string;
  created_at: string;
  seats: number;
};

export function useQRCodeList(restaurantId: string, initialLoading: boolean) {
  const [tables, setTables] = useState<TableWithQR[]>([]);
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tableToDelete, setTableToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (restaurantId !== '00000000-0000-0000-0000-000000000000') {
      fetchTables();
    }
  }, [restaurantId]);

  const fetchTables = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('number', { ascending: true });
      
      if (error) {
        console.error('Error fetching tables:', error);
        toast({
          title: 'Failed to load QR codes',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      setTables(data as TableWithQR[]);
    } catch (error) {
      console.error('Error in fetchTables:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (qrValue: string, tableNumber: number) => {
    // Get the SVG element
    const svgElement = document.getElementById(`qr-code-svg-${tableNumber}`);
    if (!svgElement) return;
    
    try {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      const sizeNum = 256;
      canvas.width = sizeNum;
      canvas.height = sizeNum;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      // Draw white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Convert SVG to image
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        
        // Create download link
        const a = document.createElement('a');
        a.download = `qr-code-table-${tableNumber}.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
        
        toast({
          title: "QR Code Downloaded",
          description: `QR code for Table ${tableNumber} has been saved.`,
        });
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading the QR code.",
        variant: "destructive",
      });
    }
  };

  const handleShare = (qrValue: string, tableNumber: number) => {
    // Check if Web Share API is supported
    if (navigator.share) {
      navigator.share({
        title: `QR Code for Table ${tableNumber}`,
        text: `Scan this QR code to access the menu for table ${tableNumber}`,
        url: qrValue,
      })
      .then(() => {
        toast({
          title: "QR Code Shared",
          description: "The QR code has been shared successfully.",
        });
      })
      .catch((error) => {
        console.error('Error sharing QR code:', error);
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(qrValue)
        .then(() => {
          toast({
            title: "QR Code Link Copied",
            description: "The QR code link has been copied to your clipboard.",
          });
        })
        .catch((error) => {
          console.error('Error copying to clipboard:', error);
          toast({
            title: "Copy Failed",
            description: "There was an error copying the link to clipboard.",
            variant: "destructive",
          });
        });
    }
  };

  const handleTest = (qrValue: string) => {
    window.open(qrValue, '_blank');
    
    toast({
      title: "Testing QR Code",
      description: "Opening QR code URL in a new tab for testing.",
    });
  };

  const confirmDelete = (tableId: string) => {
    setTableToDelete(tableId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteTable = async () => {
    if (!tableToDelete) return;
    
    try {
      const { error } = await supabase
        .from('tables')
        .delete()
        .eq('id', tableToDelete);
      
      if (error) {
        console.error('Error deleting table:', error);
        toast({
          title: 'Failed to delete QR code',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      // Update the state to remove the deleted table
      setTables(tables.filter(table => table.id !== tableToDelete));
      
      toast({
        title: 'QR Code Deleted',
        description: 'The QR code has been removed successfully.',
      });
    } catch (error) {
      console.error('Error in handleDeleteTable:', error);
    } finally {
      setTableToDelete(null);
    }
  };

  return {
    tables,
    isLoading,
    deleteDialogOpen,
    tableToDelete,
    fetchTables,
    handleDownload,
    handleShare,
    handleTest,
    confirmDelete,
    handleDeleteTable,
    setDeleteDialogOpen
  };
}
