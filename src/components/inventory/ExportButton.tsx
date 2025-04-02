
import React from 'react';
import { FileDown } from 'lucide-react';
import { Button, ButtonProps } from "@/components/ui/button";
import { useInventoryExport } from '@/hooks/use-inventory-export';

interface ExportButtonProps extends Omit<ButtonProps, 'onClick'> {
  data: Record<string, any>[];
  headers?: { key: string; label: string }[];
  fileName?: string;
  variant?: ButtonProps['variant'];
}

const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  headers,
  fileName = 'export-data.csv',
  variant = 'outline',
  className,
  children,
  ...props
}) => {
  const { exportInventory, defaultHeaders } = useInventoryExport();
  
  const handleExport = () => {
    exportInventory(data, headers || defaultHeaders, fileName);
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
