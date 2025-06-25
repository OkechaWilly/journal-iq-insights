
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  PlusCircle, 
  FileText, 
  TrendingUp, 
  Settings, 
  Calendar,
  Building2,
  FileBarChart,
  BookOpen
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Add Trade', href: '/add-trade', icon: PlusCircle },
  { name: 'Trade Log', href: '/trades', icon: FileText },
  { name: 'Calendar', href: '/calendar-view', icon: Calendar },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { name: 'Performance', href: '/performance', icon: BookOpen },
  { name: 'Reports', href: '/reports', icon: FileBarChart },
  { name: 'Enhanced Reports', href: '/enhanced-reports', icon: FileBarChart },
  { name: 'Institutional', href: '/institutional', icon: Building2 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="bg-slate-900 w-64 min-h-screen p-4">
      <div className="flex items-center gap-2 mb-8">
        <BarChart3 className="w-8 h-8 text-blue-400" />
        <span className="text-xl font-bold text-white">TradingJournal</span>
      </div>
      
      <nav className="space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
