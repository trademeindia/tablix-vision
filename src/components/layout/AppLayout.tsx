
import React from 'react';
import Sidebar from './Sidebar'
import { getSupabaseUrl } from '@/lib/supabaseClient'
import StorageInitializer from '@/components/storage/StorageInitializer';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const supabaseUrl = getSupabaseUrl()

  return (
    <div className="min-h-screen bg-background">
      <div className="md:pl-64">
        <Sidebar supabaseUrl={supabaseUrl} />
        <main className="py-10">
          {children}
        </main>
      </div>
      <StorageInitializer />
    </div>
  );
}
