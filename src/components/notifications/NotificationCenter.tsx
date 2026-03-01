import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Bell, 
  X, 
  AlertTriangle, 
  Info,
  AlertOctagon,
  TrendingUp
} from 'lucide-react';
import useStore from '../../store/useStore';
import { formatDate } from '../../lib/utils';

const NotificationCenter: React.FC = () => {
  const { alerts, markAlertAsRead } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'trade' | 'risk' | 'system' | 'performance'>('all');
  
  // Filter alerts based on selected filter
  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !alert.read;
    return alert.type === filter;
  });
  
  // Count unread alerts
  const unreadCount = alerts.filter(alert => !alert.read).length;
  
  // Mark all as read
  const markAllAsRead = () => {
    alerts.forEach(alert => {
      if (!alert.read) {
        markAlertAsRead(alert.id);
      }
    });
  };
  
  // Get icon for alert type
  const getAlertIcon = (type: string, severity: string) => {
    if (severity === 'danger') {
      return <AlertOctagon className="h-4 w-4 text-destructive" />;
    }
    if (severity === 'warning') {
      return <AlertTriangle className="h-4 w-4 text-warning" />;
    }
    switch (type) {
      case 'trade':
        return <Bell className="h-4 w-4 text-primary" />;
      case 'risk':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'system':
        return <Info className="h-4 w-4 text-info" />;
      case 'performance':
        return <TrendingUp className="h-4 w-4 text-success" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  // Get variant for alert type
  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'trade':
        return 'default';
      case 'risk':
        return 'warning';
      case 'system':
        return 'default';
      case 'performance':
        return 'success';
      default:
        return 'default';
    }
  };
  
  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-background border rounded-lg shadow-lg z-50">
          <Card className="border-0 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  Mark all read
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Filter Tabs */}
              <div className="flex border-b">
                {(['all', 'unread', 'trade', 'risk', 'system', 'performance'] as const).map((tab) => (
                  <Button
                    key={tab}
                    variant="ghost"
                    size="sm"
                    className={`rounded-none border-b-2 ${
                      filter === tab 
                        ? 'border-primary text-primary' 
                        : 'border-transparent hover:border-muted-foreground'
                    }`}
                    onClick={() => setFilter(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {tab === 'unread' && unreadCount > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
              
              {/* Alerts List */}
              <div className="max-h-96 overflow-y-auto">
                {filteredAlerts.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredAlerts.map((alert) => (
                      <div 
                        key={alert.id} 
                        className={`p-4 hover:bg-muted/50 ${
                          !alert.read ? 'bg-primary/5 border-l-4 border-primary' : ''
                        }`}
                      >
                        <div className="flex justify-between">
                          <div className="flex items-start">
                            <div className="mt-0.5 mr-3">
                              {getAlertIcon(alert.type, alert.severity)}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{alert.message}</p>
                              <div className="flex items-center mt-1">
                                <Badge variant={getAlertVariant(alert.type)} className="mr-2">
                                  {alert.type}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(alert.timestamp)}
                                </span>
                              </div>
                            </div>
                          </div>
                          {!alert.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 ml-2"
                              onClick={() => markAlertAsRead(alert.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;