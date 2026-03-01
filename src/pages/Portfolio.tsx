import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Download,
  Upload,
  RefreshCw,
  Eye
} from 'lucide-react';
import { formatCurrency, formatPercent } from '../lib/utils';
import PerformanceChart from '../components/charts/PerformanceChart';
import AllocationChart from '../components/charts/AllocationChart';

const Portfolio: React.FC = () => {
  // Mock portfolio data
  const portfolioSummary = {
    totalValue: 12540.75,
    todayPnL: 342.65,
    todayPnLPercent: 2.8,
    totalPnL: 2156.32,
    totalPnLPercent: 20.8,
    winRate: 68.5,
    totalTrades: 142,
    winningTrades: 97,
    losingTrades: 45
  };
  
  const positions = [
    { 
      id: '1', 
      market: 'Will BTC reach $100k by EOY?', 
      side: 'buy', 
      size: 1000, 
      entryPrice: 0.62, 
      currentPrice: 0.65, 
      pnl: 48.39, 
      pnlPercentage: 7.74,
      dateOpened: '2024-01-15'
    },
    { 
      id: '2', 
      market: 'Will Trump win 2024 election?', 
      side: 'sell', 
      size: 500, 
      entryPrice: 0.45, 
      currentPrice: 0.42, 
      pnl: -33.33, 
      pnlPercentage: -7.41,
      dateOpened: '2024-01-20'
    },
    { 
      id: '3', 
      market: 'Will Fed cut rates in 2024?', 
      side: 'buy', 
      size: 750, 
      entryPrice: 0.75, 
      currentPrice: 0.78, 
      pnl: 30.00, 
      pnlPercentage: 4.00,
      dateOpened: '2024-01-25'
    },
    { 
      id: '4', 
      market: 'Will Nvidia beat earnings?', 
      side: 'buy', 
      size: 600, 
      entryPrice: 0.82, 
      currentPrice: 0.85, 
      pnl: 21.95, 
      pnlPercentage: 3.66,
      dateOpened: '2024-02-01'
    },
    { 
      id: '5', 
      market: 'Will SpaceX land Starship successfully?', 
      side: 'sell', 
      size: 400, 
      entryPrice: 0.38, 
      currentPrice: 0.35, 
      pnl: 12.00, 
      pnlPercentage: 3.16,
      dateOpened: '2024-02-05'
    },
  ];
  
  const closedPositions = [
    { 
      id: '6', 
      market: 'Will inflation exceed 4% in Q1?', 
      side: 'buy', 
      size: 300, 
      entryPrice: 0.55, 
      exitPrice: 0.62, 
      pnl: 38.18, 
      pnlPercentage: 12.73,
      dateOpened: '2024-01-10',
      dateClosed: '2024-01-20'
    },
    { 
      id: '7', 
      market: 'Will Apple release new iPhone in March?', 
      side: 'sell', 
      size: 250, 
      entryPrice: 0.70, 
      exitPrice: 0.65, 
      pnl: 17.86, 
      pnlPercentage: 7.14,
      dateOpened: '2024-01-12',
      dateClosed: '2024-01-25'
    },
  ];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Portfolio</h1>
          <p className="text-muted-foreground">Track your investments and performance</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <Wallet className="h-10 w-10 text-primary mr-4" />
            <div>
              <p className="text-sm text-muted-foreground">Portfolio Value</p>
              <p className="text-2xl font-bold">{formatCurrency(portfolioSummary.totalValue)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <TrendingUp className="h-10 w-10 text-success mr-4" />
            <div>
              <p className="text-sm text-muted-foreground">Today's P&L</p>
              <p className={`text-2xl font-bold ${portfolioSummary.todayPnL >= 0 ? 'text-success' : 'text-destructive'}`}>
                {portfolioSummary.todayPnL >= 0 ? '+' : ''}{formatCurrency(portfolioSummary.todayPnL)}
              </p>
              <p className={`text-xs ${portfolioSummary.todayPnL >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatPercent(portfolioSummary.todayPnLPercent)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <TrendingUp className="h-10 w-10 text-primary mr-4" />
            <div>
              <p className="text-sm text-muted-foreground">Total P&L</p>
              <p className={`text-2xl font-bold ${portfolioSummary.totalPnL >= 0 ? 'text-success' : 'text-destructive'}`}>
                {portfolioSummary.totalPnL >= 0 ? '+' : ''}{formatCurrency(portfolioSummary.totalPnL)}
              </p>
              <p className={`text-xs ${portfolioSummary.totalPnL >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatPercent(portfolioSummary.totalPnLPercent)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <TrendingUp className="h-10 w-10 text-secondary mr-4" />
            <div>
              <p className="text-sm text-muted-foreground">Win Rate</p>
              <p className="text-2xl font-bold">{portfolioSummary.winRate.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">
                {portfolioSummary.winningTrades}/{portfolioSummary.totalTrades} trades
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart />
        <AllocationChart />
      </div>
      
      {/* Active Positions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Active Positions</CardTitle>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Market</th>
                  <th className="text-left py-3 px-2">Side</th>
                  <th className="text-left py-3 px-2">Size</th>
                  <th className="text-left py-3 px-2">Entry Price</th>
                  <th className="text-left py-3 px-2">Current Price</th>
                  <th className="text-left py-3 px-2">P&L</th>
                  <th className="text-left py-3 px-2">Date Opened</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position) => (
                  <tr key={position.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-2">
                      <div className="font-medium">{position.market}</div>
                    </td>
                    <td className="py-3 px-2">
                      <Badge variant={position.side === 'buy' ? 'success' : 'destructive'}>
                        {position.side.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-2">{formatCurrency(position.size)}</td>
                    <td className="py-3 px-2">{position.entryPrice.toFixed(3)}</td>
                    <td className="py-3 px-2">{position.currentPrice.toFixed(3)}</td>
                    <td className={`py-3 px-2 font-medium ${position.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {position.pnl >= 0 ? '+' : ''}{formatCurrency(position.pnl)}
                      <div className={`text-xs ${position.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {formatPercent(position.pnlPercentage)}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {new Date(position.dateOpened).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Closed Positions */}
      <Card>
        <CardHeader>
          <CardTitle>Closed Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Market</th>
                  <th className="text-left py-3 px-2">Side</th>
                  <th className="text-left py-3 px-2">Size</th>
                  <th className="text-left py-3 px-2">Entry Price</th>
                  <th className="text-left py-3 px-2">Exit Price</th>
                  <th className="text-left py-3 px-2">P&L</th>
                  <th className="text-left py-3 px-2">Dates</th>
                </tr>
              </thead>
              <tbody>
                {closedPositions.map((position) => (
                  <tr key={position.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-2">
                      <div className="font-medium">{position.market}</div>
                    </td>
                    <td className="py-3 px-2">
                      <Badge variant={position.side === 'buy' ? 'success' : 'destructive'}>
                        {position.side.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-2">{formatCurrency(position.size)}</td>
                    <td className="py-3 px-2">{position.entryPrice.toFixed(3)}</td>
                    <td className="py-3 px-2">{position.exitPrice.toFixed(3)}</td>
                    <td className={`py-3 px-2 font-medium ${position.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {position.pnl >= 0 ? '+' : ''}{formatCurrency(position.pnl)}
                      <div className={`text-xs ${position.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {formatPercent(position.pnlPercentage)}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground text-sm">
                      <div>{new Date(position.dateOpened).toLocaleDateString()}</div>
                      <div>{new Date(position.dateClosed).toLocaleDateString()}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Portfolio;