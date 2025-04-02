
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Lock, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { DEMO_EMAIL, DEMO_PASSWORD } from '@/constants/auth-constants';

export const DemoCredentials: React.FC = () => {
  const copyCredentials = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "You can now paste the credentials",
      });
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast({
        title: "Failed to copy",
        description: "Please try again or copy manually",
        variant: "destructive"
      });
    });
  };

  return (
    <div className="mb-6 bg-amber-50 rounded-lg p-4 border border-amber-100">
      <h3 className="text-amber-800 font-medium text-sm mb-2">Demo Credentials</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Mail className="h-3.5 w-3.5 text-amber-600 mr-2" />
            <span className="text-amber-700 text-sm font-mono">{DEMO_EMAIL}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-amber-600 hover:text-amber-700 hover:bg-amber-100"
            onClick={() => copyCredentials(DEMO_EMAIL)}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Lock className="h-3.5 w-3.5 text-amber-600 mr-2" />
            <span className="text-amber-700 text-sm font-mono">{DEMO_PASSWORD}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-amber-600 hover:text-amber-700 hover:bg-amber-100"
            onClick={() => copyCredentials(DEMO_PASSWORD)}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
