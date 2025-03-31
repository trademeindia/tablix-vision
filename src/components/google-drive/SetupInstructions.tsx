
import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from '@/components/ui/button';
import { Info, ExternalLink } from 'lucide-react';

interface SetupInstructionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SetupInstructions: React.FC<SetupInstructionsProps> = ({ open, onOpenChange }) => {
  return (
    <Collapsible
      open={open}
      onOpenChange={onOpenChange}
      className="w-full border rounded-md p-2"
    >
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">Google Drive Setup Instructions</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <Info className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="px-4 pt-2 pb-4 text-sm">
        <div className="space-y-4">
          <div>
            <h5 className="font-medium mb-1">1. Create a Google Cloud Project</h5>
            <ol className="list-decimal list-inside pl-2 text-xs space-y-1 text-muted-foreground">
              <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center inline-flex"><span>Google Cloud Console</span><ExternalLink className="h-3 w-3 ml-0.5" /></a></li>
              <li>Create a new project or select an existing one</li>
              <li>Enable the Google Drive API for your project</li>
            </ol>
          </div>
          
          <div>
            <h5 className="font-medium mb-1">2. Configure OAuth Consent Screen</h5>
            <ol className="list-decimal list-inside pl-2 text-xs space-y-1 text-muted-foreground">
              <li>Go to "OAuth consent screen" in the API & Services section</li>
              <li>Select "External" for User Type</li>
              <li>Fill in required fields (App name, email)</li>
              <li>Add scopes: ".../auth/drive" and ".../auth/drive.file"</li>
              <li>Add yourself as a test user</li>
            </ol>
          </div>
          
          <div>
            <h5 className="font-medium mb-1">3. Create OAuth Client ID</h5>
            <ol className="list-decimal list-inside pl-2 text-xs space-y-1 text-muted-foreground">
              <li>Go to "Credentials" in the API & Services section</li>
              <li>Create OAuth client ID</li>
              <li>Application type: Web application</li>
              <li>Add redirect URI: <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">https://developers.google.com/oauthplayground</span></li>
              <li>Save your Client ID and Client Secret</li>
            </ol>
          </div>
          
          <div>
            <h5 className="font-medium mb-1">4. Generate Refresh Token</h5>
            <ol className="list-decimal list-inside pl-2 text-xs space-y-1 text-muted-foreground">
              <li>Go to <a href="https://developers.google.com/oauthplayground/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center inline-flex"><span>OAuth 2.0 Playground</span><ExternalLink className="h-3 w-3 ml-0.5" /></a></li>
              <li>Click the settings icon (⚙️) in the top right</li>
              <li>Check "Use your own OAuth credentials"</li>
              <li>Enter your OAuth Client ID and Secret</li>
              <li>Click "Close"</li>
              <li>Select "Drive API v3" from the list and select both scopes</li>
              <li>Click "Authorize APIs" and sign in with your Google account</li>
              <li>Click "Exchange authorization code for tokens"</li>
              <li>Save the Refresh Token</li>
            </ol>
          </div>
          
          <div>
            <h5 className="font-medium mb-1">5. Add Credentials to Supabase</h5>
            <ol className="list-decimal list-inside pl-2 text-xs space-y-1 text-muted-foreground">
              <li>Go to your Supabase project's "Settings" &gt; "Edge Functions"</li>
              <li>Add the following secrets:</li>
              <li><span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">GOOGLE_CLIENT_ID</span>: Your OAuth Client ID</li>
              <li><span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">GOOGLE_CLIENT_SECRET</span>: Your OAuth Client Secret</li>
              <li><span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">GOOGLE_REFRESH_TOKEN</span>: The refresh token from step 4</li>
              <li>Optionally add <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">GOOGLE_API_KEY</span> if you have one</li>
            </ol>
          </div>
          
          <div className="pt-2">
            <a 
              href="https://supabase.com/dashboard/project/qofbpjdbmisyxysfcyeb/settings/functions" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center text-xs"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Go to Supabase Edge Function Secrets
            </a>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SetupInstructions;
