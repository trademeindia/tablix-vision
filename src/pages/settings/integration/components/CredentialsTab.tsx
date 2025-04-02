
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';

interface CredentialsTabProps {
  handleSave: () => void;
}

const CredentialsTab: React.FC<CredentialsTabProps> = ({ handleSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Credentials</CardTitle>
        <CardDescription>
          Manage authentication credentials for this integration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input id="apiKey" type="password" placeholder="Enter API key" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiSecret">API Secret</Label>
            <Input id="apiSecret" type="password" placeholder="Enter API secret" />
          </div>
          
          <Button variant="outline" className="w-full mt-4">
            Verify Credentials
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} className="ml-auto">
          <Save className="mr-2 h-4 w-4" />
          Save Credentials
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CredentialsTab;
