
import React from 'react';
import { Dashboard } from '@/components/Dashboard';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { SidebarProvider } from '@/components/ui/sidebar';

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <Dashboard />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
