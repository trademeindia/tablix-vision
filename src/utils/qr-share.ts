
import { toast } from '@/hooks/use-toast';

/**
 * Shares a QR code URL using the Web Share API or copies to clipboard as fallback
 * @param qrValue The URL encoded in the QR code
 * @param description A description of what the QR code is for
 */
export const shareQRCode = (qrValue: string, description: string): void => {
  if (!qrValue) return;
  
  // Check if Web Share API is supported
  if (navigator.share) {
    navigator.share({
      title: description,
      text: `Scan this QR code: ${description}`,
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
