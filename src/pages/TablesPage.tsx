
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TableGrid from '@/components/tables/TableGrid';

// Define Table type
interface Table {
  id: string;
  number: number;
  seats: number;
  status: 'available' | 'occupied' | 'reserved';
  occupiedSince?: string;
  orderId?: string;
}

const TablesPage: React.FC = () => {
  // Sample data - converted to be mutable
  const initialTables: Table[] = [
    {
      id: "table1",
      number: 1,
      seats: 2,
      status: "available"
    },
    {
      id: "table2",
      number: 2,
      seats: 4,
      status: "occupied",
      occupiedSince: "1 hour ago",
      orderId: "1234"
    },
    {
      id: "table3",
      number: 3,
      seats: 2,
      status: "reserved"
    },
    {
      id: "table4",
      number: 4,
      seats: 6,
      status: "available"
    },
    {
      id: "table5",
      number: 5,
      seats: 4,
      status: "occupied",
      occupiedSince: "30 minutes ago",
      orderId: "1235"
    },
    {
      id: "table6",
      number: 6,
      seats: 2,
      status: "available"
    },
    {
      id: "table7",
      number: 7,
      seats: 8,
      status: "occupied",
      occupiedSince: "2 hours ago",
      orderId: "1236"
    },
    {
      id: "table8",
      number: 8,
      seats: 4,
      status: "available"
    }
  ];

  const [tables, setTables] = useState<Table[]>(initialTables);

  const handleStatusChange = (tableId: string, newStatus: 'available' | 'occupied' | 'reserved') => {
    setTables(prevTables => 
      prevTables.map(table => 
        table.id === tableId ? { ...table, status: newStatus } : table
      )
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Table Management</h1>
        <p className="text-slate-500">Manage your restaurant tables and their status</p>
      </div>
      
      <TableGrid tables={tables} onStatusChange={handleStatusChange} />
    </DashboardLayout>
  );
};

export default TablesPage;
