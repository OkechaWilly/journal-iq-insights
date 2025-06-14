
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, Download } from 'lucide-react';

export const QuickActions = () => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" className="gap-2">
        <Download className="w-4 h-4" />
        Export
      </Button>
      <Button variant="outline" size="sm" className="gap-2" asChild>
        <Link to="/reports">
          <FileText className="w-4 h-4" />
          Report
        </Link>
      </Button>
      <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700" asChild>
        <Link to="/add-trade">
          <PlusCircle className="w-4 h-4" />
          Add Trade
        </Link>
      </Button>
    </div>
  );
};
