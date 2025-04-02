
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Save } from 'lucide-react';

interface GeneralTabProps {
  name: string;
  setName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  apiEndpoint: string;
  setApiEndpoint: (value: string) => void;
  webhookUrl: string;
  setWebhookUrl: (value: string) => void;
  handleSave: () => void;
  handleDelete: () => void;
}

const GeneralTab: React.FC<GeneralTabProps> = ({
  name,
  setName,
  description,
  setDescription,
  apiEndpoint,
  setApiEndpoint,
  webhookUrl,
  setWebhookUrl,
  handleSave,
  handleDelete
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integration Settings</CardTitle>
        <CardDescription>
          Manage basic settings for this integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Integration Name</Label>
          <Input 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="apiEndpoint">API Endpoint URL</Label>
          <Input 
            id="apiEndpoint" 
            value={apiEndpoint} 
            onChange={(e) => setApiEndpoint(e.target.value)}
            placeholder="https://api.example.com"
          />
          <p className="text-sm text-muted-foreground">
            The base URL for the third-party API.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="webhookUrl">Webhook URL</Label>
          <Input 
            id="webhookUrl" 
            value={webhookUrl} 
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://hooks.example.com/webhook"
          />
          <p className="text-sm text-muted-foreground">
            Webhook URL to receive data from the third-party service.
          </p>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="destructive" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Disconnect
        </Button>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GeneralTab;
