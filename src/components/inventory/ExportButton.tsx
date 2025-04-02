
import React from 'react';
import { FileDown } from 'lucide-react';
import { Button, ButtonProps } from "@/components/ui/button";
import { exportToCSV } from '@/utils/export';

interface ExportButtonProps extends Omit<ButtonProps, 'onClick'> {
  data: Record<string, any>[];
  headers: { key: string; label: string }[];
  fileName: string;
  variant?: ButtonProps['variant'];
}

const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  headers,
  fileName,
  variant = 'outline',
  className,
  children,
  ...props
}) => {
  const handleExport = () => {
    exportToCSV(data, headers, fileName);
  };

  return (
    <Button 
      variant={variant} 
      className={className}
      onClick={handleExport}
      disabled={!data.length}
      {...props}
    >
      <FileDown className="mr-2 h-4 w-4" />
      {children || 'Export'}
    </Button>
  );
};

export default ExportButton;
