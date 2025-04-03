
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Header: React.FC = () => {
  const location = useLocation();
  
  // Function to get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Dashboard';
    if (path === '/collections') return 'Collections';
    if (path.startsWith('/collections/')) return 'Collection Details';
    if (path === '/users') return 'Users';
    if (path === '/settings') return 'Settings';
    if (path === '/activity') return 'Activity Log';
    
    return 'Directus';
  };
  
  return (
    <header className="h-16 border-b border-directus-border bg-white flex items-center justify-between px-4 md:px-8">
      <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
      
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <input
            type="text"
            className="pl-10 pr-4 py-2 rounded-full border border-gray-200 w-64 focus:outline-none focus:ring-2 focus:ring-directus-blue focus:border-transparent"
            placeholder="Search..."
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        
        <Button variant="ghost" size="icon" className="text-gray-600">
          <Bell size={20} />
        </Button>
      </div>
    </header>
  );
};
