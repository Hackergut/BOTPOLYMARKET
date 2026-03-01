import React from 'react';
import { Bell, Settings, User, Menu, X } from 'lucide-react';
import { Button } from './ui/Button';
import useStore from '../store/useStore';

const Header: React.FC = () => {
  const { isSidebarCollapsed, toggleSidebar } = useStore();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2 lg:hidden"
            onClick={toggleSidebar}
          >
            {isSidebarCollapsed ? (
              <Menu className="h-6 w-6" />
            ) : (
              <X className="h-6 w-6" />
            )}
          </Button>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">P</span>
            </div>
            <h1 className="text-xl font-bold font-display">Polymarket Bot</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;