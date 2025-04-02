
import React from 'react';
import Spinner from '@/components/ui/spinner';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>
  );
};

export default LoadingSpinner;
