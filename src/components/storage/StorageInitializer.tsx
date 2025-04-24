
import { useEffect, useState } from 'react';
import { initializeStorage } from '@/hooks/menu/use-create-storage-bucket';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function StorageInitializer() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const setupStorage = async () => {
    try {
      setIsInitializing(true);
      setError(null);
      
      const success = await initializeStorage();
      
      if (success) {
        setInitialized(true);
        toast({
          title: "Storage initialized",
          description: "Storage system is ready to use",
        });
      } else {
        throw new Error("Failed to initialize storage");
      }
    } catch (err) {
      console.error('Error initializing storage:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      toast({
        title: "Storage initialization failed",
        description: "Could not set up storage system. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    // Initialize storage on component mount
    setupStorage();
  }, []);

  if (initialized) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {error && (
        <Alert variant="destructive" className="mb-2 max-w-md">
          <AlertTitle>Storage Error</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>{error}</p>
            <Button 
              size="sm" 
              onClick={setupStorage} 
              disabled={isInitializing}
              className="w-full"
            >
              {isInitializing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initializing...
                </>
              ) : (
                'Retry Initialization'
              )}
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {isInitializing && !error && (
        <Alert className="mb-2 max-w-md bg-slate-100">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          <AlertTitle>Setting up storage</AlertTitle>
          <AlertDescription>
            Initializing storage system...
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
