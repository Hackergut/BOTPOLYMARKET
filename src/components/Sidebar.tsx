import React from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Settings, 
  Users, 
  AlertTriangle,
  Bot,
  TrendingUp,
  Wallet,
  Brain
} from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';
import useStore from '../store/useStore';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const { isSidebarCollapsed } = useStore();
  const location = useLocation();
  
  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
    },
    {
      name: 'Trading',
      href: '/trading',
      icon: TrendingUp,
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
    },
    {
      name: 'Traders',
      href: '/traders',
      icon: Users,
    },
    {
      name: 'Agents',
      href: '/agents',
      icon: Bot,
    },
    {
      name: 'Portfolio',
      href: '/portfolio',
      icon: Wallet,
    },
    {
      name: 'Risk Management',
      href: '/risk',
      icon: AlertTriangle,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];
  
  return (
    <aside 
      className={cn(
        "fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] border-r bg-background transition-all duration-300",
        isSidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <li key={item.name}>
                  <Link to={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        isSidebarCollapsed ? "px-2" : "px-4"
                      )}
                    >
                      <Icon className={cn("h-5 w-5", isSidebarCollapsed ? "" : "mr-3")} />
                      {!isSidebarCollapsed && (
                        <span className="font-medium">{item.name}</span>
                      )}
                    </Button>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="border-t p-4">
          <div className={cn(
            "flex items-center",
            isSidebarCollapsed ? "justify-center" : "justify-start"
          )}>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <Brain className="h-4 w-4 text-primary-foreground" />
              </div>
              {!isSidebarCollapsed && (
                <div>
                  <p className="text-sm font-medium">AI Assistant</p>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
