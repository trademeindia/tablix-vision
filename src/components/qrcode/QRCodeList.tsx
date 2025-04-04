
import React from 'react';
import { useQRCodeList } from '@/hooks/use-qr-code-list';
import QRCodeCard from './QRCodeCard';
import EmptyQRCodeList from './EmptyQRCodeList';
import SkeletonQRCodeList from './SkeletonQRCodeList';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface QRCodeListProps {
  restaurantId: string;
  isLoading: boolean;
}

const QRCodeList: React.FC<QRCodeListProps> = ({ restaurantId, isLoading: initialLoading }) => {
  const {
    tables,
    isLoading,
    deleteDialogOpen,
    tableToDelete,
    fetchTables,
    handleDownload,
    handleShare,
    handleTest,
    confirmDelete,
    handleDeleteTable,
    setDeleteDialogOpen
  } = useQRCodeList(restaurantId, initialLoading);

  if (isLoading) {
    return <SkeletonQRCodeList />;
  }

  if (tables.length === 0) {
    return <EmptyQRCodeList onRefresh={fetchTables} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => (
          <QRCodeCard
            key={table.id}
            id={table.id}
            tableNumber={table.number}
            qrCodeUrl={table.qr_code_url}
            seats={table.seats}
            status={table.status}
            onDownload={handleDownload}
            onShare={handleShare}
            onTest={handleTest}
            onDelete={confirmDelete}
          />
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the QR code. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTable}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default QRCodeList;
