
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Download, Share2, Copy, Trash2, Trash, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface QRCodeListProps {
  restaurantId: string;
  isLoading: boolean;
}

type TableWithQR = {
  id: string;
  number: number;
  qr_code_url: string;
  status: string;
  created_at: string;
  seats: number;
};

const QRCodeList: React.FC<QRCodeListProps> = ({ restaurantId, isLoading: initialLoading }) => {
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

  const confirmDelete = (tableId: string) => {
    setTableToDelete(tableId);
    setDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-40 w-40 mx-auto" />
                <Skeleton className="h-5 w-1/3 mx-auto" />
                <div className="flex justify-center space-x-2">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (tables.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <p className="text-center text-slate-500 mb-4">
            You haven't generated any QR codes yet. Create one using the "Generate QR Codes" tab.
          </p>
          <Button 
            variant="outline" 
            onClick={() => fetchTables()}
            className="flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => (
          <Card key={table.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="bg-white p-4 rounded-md">
                  <QRCodeSVG
                    id={`qr-code-svg-${table.number}`}
                    value={table.qr_code_url}
                    size={160}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <div className="text-center">
                  <p className="font-medium text-lg">Table {table.number}</p>
                  <p className="text-sm text-slate-500">{table.seats} seats · {table.status}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownload(table.qr_code_url, table.number)}
                  >
                    <Download className="mr-1 h-3.5 w-3.5" />
                    Download
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleShare(table.qr_code_url, table.number)}
                  >
                    <Share2 className="mr-1 h-3.5 w-3.5" />
                    Share
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => handleTest(table.qr_code_url)}
                  >
                    <Copy className="mr-1 h-3.5 w-3.5" />
                    Test
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => confirmDelete(table.id)}
                  >
                    <Trash className="mr-1 h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the QR code. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTableToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTable}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default QRCodeList;
