
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bell, Search, User, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Header = () => {
  const [isDark, setIsDark] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true; // Default to dark
  });

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <header className="bg-background border-b border-border px-6 py-4 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">JQ</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">JournalIQ</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-muted rounded-lg px-3 py-2 transition-colors duration-300">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search trades..." 
              className="bg-transparent border-none outline-none text-sm w-64 text-foreground placeholder:text-muted-foreground"
            />
          </div>
          
          <Button variant="ghost" size="sm" className="transition-colors duration-200">
            <Bell className="w-4 h-4" />
          </Button>
          
          <Button variant="ghost" size="sm" className="transition-colors duration-200">
            <User className="w-4 h-4" />
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleTheme}
            className="transition-colors duration-200 hover:bg-muted"
            title="Switch between Dark & Light mode"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
};
