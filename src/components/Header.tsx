
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">JQ</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">JournalIQ</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search trades..." 
              className="bg-transparent border-none outline-none text-sm w-64"
            />
          </div>
          
          <Button variant="ghost" size="sm">
            <Bell className="w-4 h-4" />
          </Button>
          
          <Button variant="ghost" size="sm">
            <User className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
