
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const RealtimeSyncStatus = () => {
  const [status, setStatus] = useState<'active' | 'inactive' | 'error'>('inactive');
  const [lastActivity, setLastActivity] = useState<string | null>(null);
  const [activeJobs, setActiveJobs] = useState(0);
  
  useEffect(() => {
    // In a real implementation, you would subscribe to realtime updates
    // from your sync processes
    
    // For demo purposes, we'll simulate some realtime activity
    const simulateActivity = () => {
      setStatus('active');
      setLastActivity(new Date().toISOString());
      setActiveJobs(Math.floor(Math.random() * 3) + 1);
      
      setTimeout(() => {
        setStatus('inactive');
        setActiveJobs(0);
      }, 5000);
    };
    
    // Simulate activity every 20 seconds
    const interval = setInterval(simulateActivity, 20000);
    
    // Initial simulation
    simulateActivity();
    
    // Subscribe to integration_sync_history table for real updates
    const channel = supabase.channel('realtime-sync')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'integration_sync_history',
      }, (payload) => {
        setStatus('active');
        setLastActivity(payload.new.created_at);
        // Update active jobs count
      })
      .subscribe();
      
    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);
  
  // Format the last activity time for display
  const formattedLastActivity = lastActivity 
    ? new Date(lastActivity).toLocaleTimeString() 
    : 'Never';
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Integration Sync Status</CardTitle>
        <CardDescription>Real-time monitoring of API synchronization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {status === 'active' ? (
              <>
                <Badge variant="outline" className="bg-green-100 text-green-800 animate-pulse">
                  <Activity className="h-3 w-3 mr-1" />
                  Active
                </Badge>
                {activeJobs > 0 && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    {activeJobs} job{activeJobs !== 1 ? 's' : ''} running
                  </Badge>
                )}
              </>
            ) : status === 'error' ? (
              <Badge variant="outline" className="bg-red-100 text-red-800">
                <AlertCircle className="h-3 w-3 mr-1" />
                Error
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-gray-100 text-gray-800">
                <Check className="h-3 w-3 mr-1" />
                Idle
              </Badge>
            )}
          </div>
          <div className="text-sm text-gray-500">
            Last activity: {formattedLastActivity}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealtimeSyncStatus;
