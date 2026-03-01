import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { TrendingUp, AlertTriangle, Bot, DollarSign, Activity, Plus, RefreshCw, Wallet, Zap, TrendingDown, BarChart3, Users } from 'lucide-react';
import useWallet from '../hooks/useWallet';
import useStore from '../store/useStore';
import { polymarketClient } from '../services/polymarketClient';
import { formatCurrency } from '../lib/utils';

const Dashboard: React.FC = () => {
  const { isConnected, address, connectWallet } = useWallet();
  const { portfolioValue, todayPnL, totalPnL, positions, agents, alerts, updateMarketData, updatePositions, addAlert } = useStore();
  
  const [loading, setLoading] = useState(false);
  const [realMarkets, setRealMarkets] = useState<any[]>([]);
  
  useEffect(() => {
    if (isConnected) loadData();
  }, [isConnected]);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const markets = await polymarketClient.getMarkets(10);
      if (markets && markets.length > 0) {
        const formattedMarkets = markets.map((market: any) => ({
          id: market.conditionId,
          name: market.question,
          currentPrice: market.price || 0.5,
          change24h: market.change24h || 0,
          volume: market.volume || 0
        }));
        updateMarketData(formattedMarkets);
        setRealMarkets(formattedMarkets);
      }
      
      const fetchedPositions = await polymarketClient.getPositions();
      if (fetchedPositions && fetchedPositions.length > 0) {
        const mappedPositions = fetchedPositions.map((pos: any) => ({
          id: pos.conditionId || Math.random().toString(),
          marketId: pos.conditionId || '',
          marketName: pos.marketName || pos.market || 'Unknown',
          side: pos.side?.toLowerCase() || 'buy',
          size: pos.shares || pos.quantity || 0,
          entryPrice: pos.price || 0,
          currentPrice: pos.price || 0,
          pnl: pos.pnl || 0,
          pnlPercentage: 0
        }));
        updatePositions(mappedPositions);
      }
      
      addAlert({ type: 'system', severity: 'info', message: 'Connected to Polymarket CLOB API' });
    } catch (error: any) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const refreshData = () => loadData();
  const activeAgents = agents.filter(a => a.status === 'online' || a.status === 'processing').length;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            POLYMARKET TERMINAL
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            {isConnected ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect your wallet to start trading'}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={refreshData} disabled={loading} className="border-cyan-500/30 hover:bg-cyan-500/10">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''} text-cyan-400`} />
            <span className="text-cyan-400">Refresh</span>
          </Button>
          <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 border-0">
            <Plus className="h-4 w-4 mr-2" />New Trade
          </Button>
        </div>
      </div>

      {/* Connect Wallet Card */}
      {!isConnected && (
        <div className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10"></div>
          <Card className="relative border-cyan-500/20 bg-black/40 backdrop-blur-xl">
            <CardContent className="flex items-center justify-center p-12">
              <div className="text-center max-w-md">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 mb-6 border border-cyan-500/30 glow-primary">
                  <Wallet className="h-10 w-10 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-gradient">Connect Your Wallet</h2>
                <p className="text-muted-foreground mb-6">Connect MetaMask to Polymarket to start trading with AI-powered signals.</p>
                <Button onClick={connectWallet} className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 border-0 px-8 py-3 text-lg">
                  <Wallet className="h-5 w-5 mr-2" />Connect MetaMask
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Portfolio Value */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <Card className="relative h-full glass-card border-cyan-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <DollarSign className="h-6 w-6 text-cyan-400" />
                </div>
                <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">PORTFOLIO</Badge>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-white">{formatCurrency(portfolioValue)}</p>
                <p className="text-sm text-muted-foreground mt-1">Total Value</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's P&L */}
        <div className="relative group">
          <div className={`absolute -inset-0.5 bg-gradient-to-r rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity ${todayPnL >= 0 ? 'from-green-500 to-cyan-500' : 'from-red-500 to-pink-500'}`}></div>
          <Card className="relative h-full glass-card border-white/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${todayPnL >= 0 ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                  {todayPnL >= 0 ? <TrendingUp className="h-6 w-6 text-green-400" /> : <TrendingDown className="h-6 w-6 text-red-400" />}
                </div>
                <Badge variant="outline" className={todayPnL >= 0 ? 'border-green-500/30 text-green-400' : 'border-red-500/30 text-red-400'}>TODAY</Badge>
              </div>
              <div className="mt-4">
                <p className={`text-3xl font-bold ${todayPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {todayPnL >= 0 ? '+' : ''}{formatCurrency(todayPnL)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Today's P&L</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Total P&L */}
        <div className="relative group">
          <div className={`absolute -inset-0.5 bg-gradient-to-r rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity ${totalPnL >= 0 ? 'from-purple-500 to-pink-500' : 'from-red-500 to-orange-500'}`}></div>
          <Card className="relative h-full glass-card border-white/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${totalPnL >= 0 ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                  <Activity className={`h-6 w-6 ${totalPnL >= 0 ? 'text-purple-400' : 'text-red-400'}`} />
                </div>
                <Badge variant="outline" className={totalPnL >= 0 ? 'border-purple-500/30 text-purple-400' : 'border-red-500/30 text-red-400'}>TOTAL</Badge>
              </div>
              <div className="mt-4">
                <p className={`text-3xl font-bold ${totalPnL >= 0 ? 'text-purple-400' : 'text-red-400'}`}>
                  {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">All Time P&L</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Agents */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <Card className="relative h-full glass-card border-pink-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20">
                  <Bot className="h-6 w-6 text-pink-400" />
                </div>
                <Badge variant="outline" className="border-pink-500/30 text-pink-400">AI AGENTS</Badge>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-white">{activeAgents}<span className="text-lg text-muted-foreground">/{agents.length}</span></p>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                  <Zap className="h-3 w-3 text-yellow-400" /> Active Agents
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Positions */}
          <Card className="glass-card border-white/5 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-white/5">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-cyan-400" />
                <span>Open Positions</span>
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-cyan-400 hover:bg-cyan-500/10">View All</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {positions.length === 0 ? (
                  <div className="text-center py-12">
                    <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No open positions</p>
                  </div>
                ) : (
                  positions.map((position: any, index: number) => (
                    <div key={index} className="p-4 hover:bg-white/5">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium truncate">{position.marketName}</p>
                          <div className="flex items-center mt-2 gap-2">
                            <Badge className={position.side === 'buy' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}>
                              {position.side.toUpperCase()}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{position.size} shares</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {position.pnl >= 0 ? '+' : ''}{formatCurrency(position.pnl)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Markets */}
          <Card className="glass-card border-white/5 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-white/5">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-400" />
                <span>Live Markets</span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-sm text-muted-foreground">Live</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {realMarkets.length === 0 ? (
                  <div className="text-center py-12">
                    <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Loading markets...</p>
                  </div>
                ) : (
                  realMarkets.slice(0, 8).map((market) => (
                    <div key={market.id} className="p-4 hover:bg-white/5 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium truncate">{market.name}</p>
                          <p className="text-sm text-muted-foreground">Vol: ${(market.volume || 0).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-white">{market.currentPrice?.toFixed(3)}</p>
                          <p className={`text-sm ${market.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {market.change24h >= 0 ? '+' : ''}{market.change24h?.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* AI Agents */}
          <Card className="glass-card border-white/5 overflow-hidden">
            <CardHeader className="pb-4 border-b border-white/5">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-pink-400" />
                <span>AI Agents</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {agents.length === 0 ? (
                  <div className="text-center py-8">
                    <Bot className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No agents active</p>
                  </div>
                ) : (
                  agents.map((agent) => (
                    <div key={agent.id} className="p-4 hover:bg-white/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${agent.status === 'online' ? 'bg-green-500/20 border border-green-500/30' : 'bg-muted/20 border border-muted/30'}`}>
                            <Bot className={`h-5 w-5 ${agent.status === 'online' ? 'text-green-400' : 'text-muted-foreground'}`} />
                          </div>
                          <div>
                            <p className="font-medium">{agent.name}</p>
                            <p className="text-xs text-muted-foreground">{agent.confidence}% confidence</p>
                          </div>
                        </div>
                        <Badge className={agent.status === 'online' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}>
                          {agent.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Alerts */}
          <Card className="glass-card border-white/5 overflow-hidden">
            <CardHeader className="pb-4 border-b border-white/5">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <span>System Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {alerts.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No alerts</p>
                  </div>
                ) : (
                  alerts.slice(0, 5).map((alert, index) => (
                    <div key={index} className="p-4 hover:bg-white/5">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${alert.severity === 'danger' ? 'bg-red-500' : alert.severity === 'warning' ? 'bg-yellow-500' : 'bg-cyan-500'}`}></div>
                        <p className="text-sm">{alert.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="glass-card border-gradient">
            <CardContent className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="border-cyan-500/30 hover:bg-cyan-500/10">
                  <Users className="h-4 w-4 mr-2 text-cyan-400" />
                  Copy Trade
                </Button>
                <Button variant="outline" className="border-purple-500/30 hover:bg-purple-500/10">
                  <BarChart3 className="h-4 w-4 mr-2 text-purple-400" />
                  Analytics
                </Button>
                <Button variant="outline" className="border-pink-500/30 hover:bg-pink-500/10">
                  <Bot className="h-4 w-4 mr-2 text-pink-400" />
                  AI Agents
                </Button>
                <Button variant="outline" className="border-green-500/30 hover:bg-green-500/10">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-400" />
                  Markets
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
