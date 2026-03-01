import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  AlertTriangle,
  Bot,
  DollarSign,
  Activity
} from 'lucide-react';

const Home: React.FC = () => {
  // Mock data for demonstration
  const portfolioStats = {
    totalValue: 12540.75,
    todayPnL: 342.65,
    todayPnLPercent: 2.8,
    totalPnL: 2156.32,
    totalPnLPercent: 20.8
  };

  const recentPositions = [
    { id: 1, market: 'Will BTC reach $100k by EOY?', side: 'buy', size: 1000, pnl: 42.50, status: 'active' },
    { id: 2, market: 'Will Fed cut rates in 2024?', side: 'sell', size: 500, pnl: -12.30, status: 'closed' },
    { id: 3, market: 'Will Nvidia beat earnings?', side: 'buy', size: 750, pnl: 68.90, status: 'active' },
  ];

  const agentStatus = [
    { id: 1, name: 'Data Analyst', status: 'online', confidence: 95 },
    { id: 2, name: 'Sentiment Agent', status: 'processing', confidence: 87 },
    { id: 3, name: 'Risk Manager', status: 'online', confidence: 92 },
    { id: 4, name: 'Strategy Selector', status: 'paused', confidence: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="primary">New Trade</Button>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <DollarSign className="h-10 w-10 text-primary mr-4" />
            <div>
              <p className="text-sm text-muted-foreground">Portfolio Value</p>
              <p className="text-2xl font-bold">${portfolioStats.totalValue.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <TrendingUp className="h-10 w-10 text-success mr-4" />
            <div>
              <p className="text-sm text-muted-foreground">Today's P&L</p>
              <p className="text-2xl font-bold text-success">+${portfolioStats.todayPnL.toFixed(2)}</p>
              <p className="text-xs text-success">+{portfolioStats.todayPnLPercent}%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Activity className="h-10 w-10 text-primary mr-4" />
            <div>
              <p className="text-sm text-muted-foreground">Total P&L</p>
              <p className="text-2xl font-bold text-success">+${portfolioStats.totalPnL.toFixed(2)}</p>
              <p className="text-xs text-success">+{portfolioStats.totalPnLPercent}%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Bot className="h-10 w-10 text-secondary mr-4" />
            <div>
              <p className="text-sm text-muted-foreground">Active Agents</p>
              <p className="text-2xl font-bold">3/4</p>
              <p className="text-xs text-warning">1 paused</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Positions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPositions.map((position) => (
                <div key={position.id} className="flex justify-between items-center p-3 bg-card rounded-lg">
                  <div>
                    <p className="font-medium">{position.market}</p>
                    <div className="flex items-center mt-1">
                      <Badge variant={position.side === 'buy' ? 'success' : 'destructive'}>
                        {position.side.toUpperCase()}
                      </Badge>
                      <span className="ml-2 text-sm text-muted-foreground">${position.size}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${position.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">{position.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Agent Status */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agentStatus.map((agent) => (
                <div key={agent.id} className="flex justify-between items-center p-3 bg-card rounded-lg">
                  <div>
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Confidence: {agent.confidence}%
                    </p>
                  </div>
                  <Badge variant={
                    agent.status === 'online' ? 'success' : 
                    agent.status === 'processing' ? 'warning' : 'destructive'
                  }>
                    {agent.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-warning" />
              Recent Alerts
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-warning/10 rounded-lg">
              <p>High volatility detected in BTC markets</p>
              <Badge variant="warning">Warning</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
              <p>New trading opportunity identified</p>
              <Badge variant="success">Opportunity</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-info/10 rounded-lg">
              <p>Agent update completed successfully</p>
              <Badge variant="default">Info</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;