
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  BookOpen, 
  DollarSign, 
  Home, 
  PlusCircle, 
  Settings, 
  TrendingUp,
  Calendar as CalendarIcon,
  FileText
} from 'lucide-react';
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Add Trade",
    url: "/add-trade",
    icon: PlusCircle,
  },
  {
    title: "Trade Log",
    url: "/trade-log",
    icon: BookOpen,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Performance",
    url: "/performance",
    icon: TrendingUp,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: CalendarIcon,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
  },
];

const bottomItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <SidebarContainer className="border-r border-slate-700 bg-slate-900">
      <SidebarContent className="bg-slate-900">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">TradeFlow</h2>
              <p className="text-slate-400 text-xs">Pro Trading Journal</p>
            </div>
          </div>
        </div>
        
        <SidebarGroup className="px-4 py-4">
          <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Trading
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`rounded-lg transition-all duration-200 ${
                      location.pathname === item.url 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Link to={item.url} className="flex items-center gap-3 px-3 py-2.5">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup className="mt-auto px-4 py-4">
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`rounded-lg transition-all duration-200 ${
                      location.pathname === item.url 
                        ? 'bg-slate-800 text-white' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Link to={item.url} className="flex items-center gap-3 px-3 py-2.5">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarContainer>
  );
};
