
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, Download } from 'lucide-react';

export const QuickActions = () => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" className="gap-2">
        <Download className="w-4 h-4" />
        Export
      </Button>
      <Button variant="outline" size="sm" className="gap-2">
        <FileText className="w-4 h-4" />
        Report
      </Button>
      <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
        <PlusCircle className="w-4 h-4" />
        Add Trade
      </Button>
    </div>
  );
};
