
import { useState, useEffect } from 'react';
import { supabase, setupRealtimeListener, removeRealtimeListener } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RealtimeStatusDisplay = () => {
  const [realtimeStatus, setRealtimeStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [listeningTables, setListeningTables] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    checkRealtimeStatus();
    
    // Set up a simple test listener
    const channel = setupRealtimeListener(
      'orders',
      '*',
      (payload) => {
        console.log('Realtime test payload received:', payload);
        toast({
          title: 'Realtime Update Received',
          description: `${payload.eventType} event on table ${payload.table}`,
        });
      }
    );
    
    return () => {
      removeRealtimeListener(channel);
    };
  }, []);
  
  const checkRealtimeStatus = async () => {
    setIsChecking(true);
    try {
      // Check if we can connect to realtime
      const channel = supabase.channel('realtime-test');
      
      channel
        .on('presence', { event: 'sync' }, () => {
          console.log('Realtime presence sync received');
          setRealtimeStatus('connected');
          setIsChecking(false);
        })
        .on('presence', { event: 'join' }, () => {
          console.log('Realtime presence join received');
        })
        .on('system', { event: 'disconnect' }, () => {
          console.log('Realtime system disconnect received');
          setRealtimeStatus('disconnected');
          setIsChecking(false);
        })
        .subscribe((status: string) => {
          console.log('Realtime subscription status:', status);
          if (status === 'SUBSCRIBED') {
            setRealtimeStatus('connected');
          } else {
            setRealtimeStatus('disconnected');
          }
          setIsChecking(false);
        });
      
      // Check which tables have realtime enabled
      const { data, error } = await supabase.rpc('get_realtime_tables');
      
      if (!error && data) {
        setListeningTables(data);
      }
      
    } catch (error) {
      console.error('Error checking realtime status:', error);
      setRealtimeStatus('disconnected');
      setIsChecking(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Realtime Status
          {realtimeStatus === 'connected' ? (
            <Wifi className="h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-500" />
          )}
        </CardTitle>
        <CardDescription>
          Real-time updates allow for live data syncing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span>Status:</span>
            <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
              realtimeStatus === 'connected' 
                ? 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80' 
                : 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80'
            } gap-1 px-2 py-0.5`}>
              {realtimeStatus === 'checking' ? 'Checking...' : realtimeStatus === 'connected' ? 'Connected' : 'Disconnected'}
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Tables with realtime enabled:</p>
            {listeningTables.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {listeningTables.map((table) => (
                  <div key={table} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-foreground border-border">
                    {table}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No tables configured for realtime updates</p>
            )}
          </div>
        </div>
        
        <Button 
          onClick={checkRealtimeStatus} 
          disabled={isChecking}
          variant="outline" 
          size="sm"
          className="w-full"
        >
          {isChecking ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Check Connection
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RealtimeStatusDisplay;
