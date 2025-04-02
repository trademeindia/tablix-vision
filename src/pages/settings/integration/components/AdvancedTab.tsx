
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save } from 'lucide-react';

interface AdvancedTabProps {
  handleSave: () => void;
}

const AdvancedTab: React.FC<AdvancedTabProps> = ({ handleSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Settings</CardTitle>
        <CardDescription>
          Configure advanced options for this integration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="debug">Debug Mode</Label>
              <Switch id="debug" />
            </div>
            <p className="text-sm text-muted-foreground">
              Enable detailed logging for troubleshooting.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="errorNotify">Error Notifications</Label>
              <Switch id="errorNotify" defaultChecked />
            </div>
            <p className="text-sm text-muted-foreground">
              Receive notifications when integration errors occur.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timeout">Request Timeout (seconds)</Label>
            <Input id="timeout" type="number" defaultValue="30" min="5" max="300" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} className="ml-auto">
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdvancedTab;
