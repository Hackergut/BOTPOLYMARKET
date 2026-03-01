import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  Shield, 
  AlertTriangle, 
  Settings,
  Play,
  Pause,
  Save,
  RotateCcw
} from 'lucide-react';
import { formatCurrency, formatPercent } from '../lib/utils';

const Risk: React.FC = () => {
  const [isRiskManagementActive, setIsRiskManagementActive] = useState(true);
  
  // Mock risk settings
  const [riskSettings, setRiskSettings] = useState({
    maxDrawdown: 20, // Percentage
    positionSizeLimit: 10, // Percentage of portfolio
    dailyLossLimit: 5, // Percentage of portfolio
    maxPositions: 10,
    volatilityThreshold: 5, // Percentage
    enableStopLoss: true,
    stopLossPercent: 15, // Percentage
    enableTakeProfit: true,
    takeProfitPercent: 30, // Percentage
  });
  
  const handleSaveSettings = () => {
    // Save settings logic
    console.log('Saving risk settings:', riskSettings);
  };
  
  const handleResetSettings = () => {
    // Reset to default settings
    setRiskSettings({
      maxDrawdown: 20,
      positionSizeLimit: 10,
      dailyLossLimit: 5,
      maxPositions: 10,
      volatilityThreshold: 5,
      enableStopLoss: true,
      stopLossPercent: 15,
      enableTakeProfit: true,
      takeProfitPercent: 30,
    });
  };
  
  // Mock current risk metrics
  const currentRiskMetrics = {
    currentDrawdown: 2.3, // Percentage
    currentPositionSize: 7.2, // Percentage of portfolio
    todayLoss: 1.1, // Percentage of portfolio
    activePositions: 6,
    currentVolatility: 3.2, // Percentage
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Risk Management</h1>
          <p className="text-muted-foreground">Configure and monitor trading risk controls</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant={isRiskManagementActive ? "destructive" : "success"}
            size="sm"
            onClick={() => setIsRiskManagementActive(!isRiskManagementActive)}
          >
            {isRiskManagementActive ? (
              <>
                <Pause className="h-4 w-4 mr-1" />
                Pause Risk Controls
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                Enable Risk Controls
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetSettings}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </div>
      
      {/* Risk Status Banner */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`rounded-full p-2 mr-4 ${isRiskManagementActive ? 'bg-success/10' : 'bg-destructive/10'}`}>
                <Shield className={`h-8 w-8 ${isRiskManagementActive ? 'text-success' : 'text-destructive'}`} />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {isRiskManagementActive ? 'Risk Management Active' : 'Risk Management Paused'}
                </h2>
                <p className="text-muted-foreground">
                  {isRiskManagementActive 
                    ? 'All risk controls are currently enforcing protective measures' 
                    : 'Risk controls are temporarily disabled'}
                </p>
              </div>
            </div>
            <Badge variant={isRiskManagementActive ? 'success' : 'destructive'}>
              {isRiskManagementActive ? 'ACTIVE' : 'PAUSED'}
            </Badge>
          </div>
        </CardContent>
      </Card>
      
      {/* Risk Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-warning mr-3" />
              <div>
                <p className="text-2xl font-bold">{currentRiskMetrics.currentDrawdown.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Current Drawdown</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-warning mr-3" />
              <div>
                <p className="text-2xl font-bold">{currentRiskMetrics.currentPositionSize.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Avg Position Size</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-warning mr-3" />
              <div>
                <p className="text-2xl font-bold">{currentRiskMetrics.todayLoss.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Today's Loss</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-warning mr-3" />
              <div>
                <p className="text-2xl font-bold">{currentRiskMetrics.activePositions}</p>
                <p className="text-sm text-muted-foreground">Active Positions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-warning mr-3" />
              <div>
                <p className="text-2xl font-bold">{currentRiskMetrics.currentVolatility.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Market Volatility</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Risk Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Risk Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              General Risk Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Max Drawdown Limit (%)</label>
              <div className="mt-1 flex items-center">
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={riskSettings.maxDrawdown}
                  onChange={(e) => setRiskSettings({...riskSettings, maxDrawdown: parseInt(e.target.value)})}
                  className="w-full"
                />
                <span className="ml-3 w-12 text-right">{riskSettings.maxDrawdown}%</span>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Position Size Limit (%)</label>
              <div className="mt-1 flex items-center">
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={riskSettings.positionSizeLimit}
                  onChange={(e) => setRiskSettings({...riskSettings, positionSizeLimit: parseInt(e.target.value)})}
                  className="w-full"
                />
                <span className="ml-3 w-12 text-right">{riskSettings.positionSizeLimit}%</span>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Daily Loss Limit (%)</label>
              <div className="mt-1 flex items-center">
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={riskSettings.dailyLossLimit}
                  onChange={(e) => setRiskSettings({...riskSettings, dailyLossLimit: parseInt(e.target.value)})}
                  className="w-full"
                />
                <span className="ml-3 w-12 text-right">{riskSettings.dailyLossLimit}%</span>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Max Concurrent Positions</label>
              <div className="mt-1 flex items-center">
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={riskSettings.maxPositions}
                  onChange={(e) => setRiskSettings({...riskSettings, maxPositions: parseInt(e.target.value)})}
                  className="w-full"
                />
                <span className="ml-3 w-12 text-right">{riskSettings.maxPositions}</span>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Volatility Threshold (%)</label>
              <div className="mt-1 flex items-center">
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={riskSettings.volatilityThreshold}
                  onChange={(e) => setRiskSettings({...riskSettings, volatilityThreshold: parseInt(e.target.value)})}
                  className="w-full"
                />
                <span className="ml-3 w-12 text-right">{riskSettings.volatilityThreshold}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Stop Loss & Take Profit */}
        <Card>
          <CardHeader>
            <CardTitle>Stop Loss & Take Profit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Stop Loss */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Enable Stop Loss</label>
                <Button 
                  variant={riskSettings.enableStopLoss ? "success" : "outline"}
                  size="sm"
                  onClick={() => setRiskSettings({...riskSettings, enableStopLoss: !riskSettings.enableStopLoss})}
                >
                  {riskSettings.enableStopLoss ? 'ON' : 'OFF'}
                </Button>
              </div>
              
              {riskSettings.enableStopLoss && (
                <div>
                  <label className="text-sm font-medium">Stop Loss Percent (%)</label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={riskSettings.stopLossPercent}
                      onChange={(e) => setRiskSettings({...riskSettings, stopLossPercent: parseInt(e.target.value)})}
                      className="w-full"
                    />
                    <span className="ml-3 w-12 text-right">{riskSettings.stopLossPercent}%</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Take Profit */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Enable Take Profit</label>
                <Button 
                  variant={riskSettings.enableTakeProfit ? "success" : "outline"}
                  size="sm"
                  onClick={() => setRiskSettings({...riskSettings, enableTakeProfit: !riskSettings.enableTakeProfit})}
                >
                  {riskSettings.enableTakeProfit ? 'ON' : 'OFF'}
                </Button>
              </div>
              
              {riskSettings.enableTakeProfit && (
                <div>
                  <label className="text-sm font-medium">Take Profit Percent (%)</label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={riskSettings.takeProfitPercent}
                      onChange={(e) => setRiskSettings({...riskSettings, takeProfitPercent: parseInt(e.target.value)})}
                      className="w-full"
                    />
                    <span className="ml-3 w-12 text-right">{riskSettings.takeProfitPercent}%</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-2 pt-4">
              <Button variant="primary" className="flex-1" onClick={handleSaveSettings}>
                <Save className="h-4 w-4 mr-1" />
                Save Settings
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleResetSettings}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Risk Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Risk Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-warning/10 rounded-lg">
              <div>
                <p className="font-medium">High Volatility Detected</p>
                <p className="text-sm text-muted-foreground">
                  BTC markets showing 8.2% volatility, exceeding threshold
                </p>
              </div>
              <Badge variant="warning">WARNING</Badge>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-destructive/10 rounded-lg">
              <div>
                <p className="font-medium">Position Size Limit Exceeded</p>
                <p className="text-sm text-muted-foreground">
                  Attempted to open position exceeding 10% portfolio limit
                </p>
              </div>
              <Badge variant="destructive">BLOCKED</Badge>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-info/10 rounded-lg">
              <div>
                <p className="font-medium">Daily Loss Limit Approaching</p>
                <p className="text-sm text-muted-foreground">
                  Current daily loss at 4.2% of portfolio, nearing 5% limit
                </p>
              </div>
              <Badge variant="default">INFO</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Risk;