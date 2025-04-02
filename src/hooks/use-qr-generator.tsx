
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function useQrGenerator(restaurantId: string) {
  const [tableNumber, setTableNumber] = useState('1');
  const [size, setSize] = useState('256');
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrValue, setQrValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!tableNumber.trim()) {
      toast({
        title: "Missing Table Number",
        description: "Please enter a table number",
        variant: "destructive",
      });
      return;
    }
    
    if (!restaurantId) {
      toast({
        title: "Missing Restaurant ID",
        description: "Restaurant ID is required to generate QR codes",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Generate the QR code
      const baseUrl = window.location.origin;
      // Use the right path and query parameters for customer menu
      const value = `${baseUrl}/customer-menu?restaurant=${restaurantId}&table=${tableNumber}`;
      
      console.log("Generated QR code with URL:", value);
      
      setQrValue(value);
      
      // Optionally save the QR code to the database
      try {
        setIsSaving(true);
        const { data, error } = await supabase
          .from('tables')
          .upsert({
            restaurant_id: restaurantId,
            number: parseInt(tableNumber),
            qr_code_url: value,
            seats: 4, // Default number of seats
            status: 'available',
          }, { onConflict: 'restaurant_id,number' })
          .select();
          
        if (error) {
          console.error("Error saving QR code to database:", error);
        } else {
          console.log("QR code saved to database:", data);
        }
      } catch (err) {
        console.error("Error in database operation:", err);
      } finally {
        setIsSaving(false);
      }
      
      toast({
        title: "QR Code Generated",
        description: `QR code for Table ${tableNumber} has been generated.`,
      });
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast({
        title: "QR Code Generation Failed",
        description: "There was an error generating the QR code.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [restaurantId, tableNumber]);

  const handleDownload = useCallback(() => {
    if (!qrValue) return;
    
    // Get the SVG element
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;
    
    try {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      const sizeNum = parseInt(size);
      canvas.width = sizeNum;
      canvas.height = sizeNum;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      // Draw white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Convert SVG to image
      const svgData = new XMLSerializer().serializeToString(svg);
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
  }, [qrValue, size, tableNumber]);

  const handleShare = useCallback(() => {
    if (!qrValue) return;
    
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
  }, [qrValue, tableNumber]);

  // For direct testing
  const handleTest = useCallback(() => {
    if (!qrValue) return;
    
    window.open(qrValue, '_blank');
    
    toast({
      title: "Testing QR Code",
      description: "Opening QR code URL in a new tab for testing.",
    });
  }, [qrValue]);

  return {
    tableNumber,
    setTableNumber,
    size,
    setSize,
    isGenerating,
    qrValue,
    isSaving,
    handleGenerate,
    handleDownload,
    handleShare,
    handleTest
  };
}
