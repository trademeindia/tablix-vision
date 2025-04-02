
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { RefreshCw, Save } from 'lucide-react';

interface SyncTabProps {
  syncFrequency: string;
  setSyncFrequency: (value: string) => void;
  handleSave: () => void;
  handleSync: () => void;
  isSyncing: boolean;
}

const SyncTab: React.FC<SyncTabProps> = ({
  syncFrequency,
  setSyncFrequency,
  handleSave,
  handleSync,
  isSyncing
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sync Settings</CardTitle>
        <CardDescription>
          Configure how and when data is synchronized
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="syncFrequency">Sync Frequency</Label>
          <Select value={syncFrequency} onValueChange={setSyncFrequency}>
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realtime">Real-time</SelectItem>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="manual">Manual Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="enableSync">Enable Automatic Sync</Label>
            <Switch id="enableSync" defaultChecked={syncFrequency !== 'manual'} />
          </div>
          <p className="text-sm text-muted-foreground">
            When enabled, data will be synchronized automatically according to the frequency setting.
          </p>
        </div>
        
        <Button 
          variant="outline"
          className="w-full" 
          onClick={handleSync}
          disabled={isSyncing}
        >
          {isSyncing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Synchronizing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync Now
            </>
          )}
        </Button>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} className="ml-auto">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SyncTab;
