import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

const Settings: React.FC = () => {
  const [apiUrl, setApiUrl] = useState('https://clob.polymarket.com');
  const [apiKey, setApiKey] = useState('');
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [autoTrade, setAutoTrade] = useState(false);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Settings</h1>
        <p className="text-muted-foreground">Configure your trading bot settings</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Polymarket API URL</label>
              <Input 
                value={apiUrl} 
                onChange={(e) => setApiUrl(e.target.value)}
                className="mt-1"
                placeholder="https://clob.polymarket.com"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">API Key (Optional)</label>
              <Input 
                type="password"
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)}
                className="mt-1"
                placeholder="Enter your API key"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your API key is encrypted and stored securely
              </p>
            </div>
            
            <Button variant="primary">Save API Configuration</Button>
          </CardContent>
        </Card>

        {/* Trading Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Trading Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Auto-Trading</p>
                <p className="text-sm text-muted-foreground">Automatically execute trades based on your strategies</p>
              </div>
              <Button 
                variant={autoTrade ? "success" : "outline"}
                size="sm"
                onClick={() => setAutoTrade(!autoTrade)}
              >
                {autoTrade ? 'ON' : 'OFF'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Notifications</p>
                <p className="text-sm text-muted-foreground">Receive alerts for trades and risk events</p>
              </div>
              <Button 
                variant={enableNotifications ? "success" : "outline"}
                size="sm"
                onClick={() => setEnableNotifications(!enableNotifications)}
              >
                {enableNotifications ? 'ON' : 'OFF'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Risk Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Default Position Size ($)</label>
              <Input 
                type="number" 
                defaultValue={1000}
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Max Daily Loss (%)</label>
                <Input 
                  type="number" 
                  defaultValue={5}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Max Position Size (%)</label>
                <Input 
                  type="number" 
                  defaultValue={10}
                  className="mt-1"
                />
              </div>
            </div>
            
            <Button variant="primary">Save Risk Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;