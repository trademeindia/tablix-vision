
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Spinner from '@/components/ui/spinner';

const LoadingState: React.FC = () => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Google Drive Integration Test</CardTitle>
        <CardDescription>
          Checking Google Drive credentials...
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center py-6">
        <Spinner size="lg" />
      </CardContent>
    </Card>
  );
};

export default LoadingState;
