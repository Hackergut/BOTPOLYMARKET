import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { TrendingUp, Bot, Plus, RefreshCw, Wallet, Zap, BarChart3, Users, ArrowUpRight, ArrowDownRight, Cpu, Radio, Settings, Bell, Search, ChevronRight } from 'lucide-react';
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
    <div className="min-h-screen bg-[#0a0e17] text-white p-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-green-500 font-mono">LIVE</span>
          </div>
          <div className="h-4 w-px bg-white/20"></div>
          <span className="text-sm text-gray-400 font-mono">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          <span className="text-sm text-gray-500 font-mono">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/5">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/5">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/5">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">
            <span className="text-white">POLY</span><span className="text-cyan-400">TERMINAL</span>
          </h1>
          <p className="text-sm text-gray-500">
            {isConnected ? (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="font-mono text-green-400">{address?.slice(0, 8)}...{address?.slice(-6)}</span>
                <span className="text-gray-600">|</span>
                <span className="text-gray-400">CLOB Connected</span>
              </span>
            ) : (
              <span className="text-gray-500">Connect wallet to access markets</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData} 
            disabled={loading} 
            className="border-white/20 text-gray-300 hover:bg-white/5 hover:text-white bg-transparent"
          >
            <RefreshCw className={`h-3 w-3 mr-2 ${loading ? 'animate-spin' : ''}`} />
            SYNC
          </Button>
          <Button className="bg-cyan-600 hover:bg-cyan-500 text-white border-0 px-4">
            <Plus className="h-3 w-3 mr-2" />NEW POSITION
          </Button>
        </div>
      </div>

      {/* Connect Wallet Banner */}
      {!isConnected && (
        <div className="mb-8 p-6 rounded-lg bg-gradient-to-r from-cyan-900/20 via-purple-900/20 to-pink-900/20 border border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Connect MetaMask Wallet</h3>
                <p className="text-sm text-gray-400">Access Polymarket CLOB for real-time trading</p>
              </div>
            </div>
            <Button onClick={connectWallet} className="bg-cyan-600 hover:bg-cyan-500 text-white border-0 px-6">
              <Wallet className="h-4 w-4 mr-2" />Connect Wallet
            </Button>
          </div>
        </div>
      )}

      {/* Stats Row - Terminal Style */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* Portfolio Value */}
        <div className="bg-[#111827] rounded-lg p-4 border border-white/5 hover:border-cyan-500/30 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">Portfolio Value</span>
            <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
          </div>
          <p className="text-2xl font-bold text-white font-mono">{formatCurrency(portfolioValue)}</p>
          <p className="text-xs text-gray-500 mt-1">Total Holdings</p>
        </div>

        {/* Today's P&L */}
        <div className="bg-[#111827] rounded-lg p-4 border border-white/5 hover:border-green-500/30 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">Today's P&L</span>
            {todayPnL >= 0 ? <ArrowUpRight className="h-4 w-4 text-green-500" /> : <ArrowDownRight className="h-4 w-4 text-red-500" />}
          </div>
          <p className={`text-2xl font-bold font-mono ${todayPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {todayPnL >= 0 ? '+' : ''}{formatCurrency(todayPnL)}
          </p>
          <p className={`text-xs mt-1 ${todayPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {todayPnL >= 0 ? '+' : ''}{(todayPnL / (portfolioValue || 1) * 100).toFixed(2)}%
          </p>
        </div>

        {/* Total P&L */}
        <div className="bg-[#111827] rounded-lg p-4 border border-white/5 hover:border-purple-500/30 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">Total P&L</span>
            {totalPnL >= 0 ? <ArrowUpRight className="h-4 w-4 text-purple-500" /> : <ArrowDownRight className="h-4 w-4 text-red-500" />}
          </div>
          <p className={`text-2xl font-bold font-mono ${totalPnL >= 0 ? 'text-purple-400' : 'text-red-400'}`}>
            {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)}
          </p>
          <p className="text-xs text-gray-500 mt-1">All Time</p>
        </div>

        {/* Active Agents */}
        <div className="bg-[#111827] rounded-lg p-4 border border-white/5 hover:border-pink-500/30 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">AI Agents</span>
            <Cpu className="h-4 w-4 text-pink-500" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">{activeAgents}<span className="text-gray-500 text-lg">/{agents.length}</span></p>
          <p className="text-xs text-pink-500 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></span>
            Active
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left - Markets (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Markets */}
          <Card className="bg-[#111827] border-white/5">
            <CardHeader className="pb-3 border-b border-white/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                  <Radio className="h-4 w-4 text-green-500" />
                  LIVE MARKETS
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-xs text-gray-500">REAL-TIME</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left text-xs text-gray-500 font-mono uppercase tracking-wider p-3">Market</th>
                      <th className="text-right text-xs text-gray-500 font-mono uppercase tracking-wider p-3">Price</th>
                      <th className="text-right text-xs text-gray-500 font-mono uppercase tracking-wider p-3">24h %</th>
                      <th className="text-right text-xs text-gray-500 font-mono uppercase tracking-wider p-3">Volume</th>
                      <th className="text-right text-xs text-gray-500 font-mono uppercase tracking-wider p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {realMarkets.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            <TrendingUp className="h-6 w-6 text-gray-600" />
                            <span>Loading market data...</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      realMarkets.slice(0, 8).map((market) => (
                        <tr key={market.id} className="border-b border-white/5 hover:bg-white/5 cursor-pointer">
                          <td className="p-3">
                            <p className="text-sm text-white font-medium truncate max-w-[200px]">{market.name}</p>
                          </td>
                          <td className="p-3 text-right">
                            <span className="text-sm text-white font-mono">{market.currentPrice?.toFixed(3)}</span>
                          </td>
                          <td className="p-3 text-right">
                            <span className={`text-sm font-mono ${market.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {market.change24h >= 0 ? '+' : ''}{market.change24h?.toFixed(2)}%
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <span className="text-sm text-gray-400 font-mono">${(market.volume || 0).toLocaleString()}</span>
                          </td>
                          <td className="p-3 text-right">
                            <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Open Positions */}
          <Card className="bg-[#111827] border-white/5">
            <CardHeader className="pb-3 border-b border-white/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-cyan-400" />
                  OPEN POSITIONS
                </CardTitle>
                <span className="text-xs text-gray-500">{positions.length} active</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {positions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm">No open positions</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {positions.slice(0, 5).map((position: any, index: number) => (
                    <div key={index} className="p-4 hover:bg-white/5">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={`text-xs ${position.side === 'buy' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                              {position.side.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-gray-500 font-mono">{position.size} shares</span>
                          </div>
                          <p className="text-sm text-white truncate">{position.marketName}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-mono font-semibold ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {position.pnl >= 0 ? '+' : ''}{formatCurrency(position.pnl)}
                          </p>
                          <p className="text-xs text-gray-500">@ {position.entryPrice.toFixed(3)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* AI Agents Panel */}
          <Card className="bg-[#111827] border-white/5">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                <Bot className="h-4 w-4 text-pink-500" />
                AI AGENTS
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {agents.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <Bot className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                    <p className="text-xs">No agents active</p>
                  </div>
                ) : (
                  agents.map((agent) => (
                    <div key={agent.id} className="p-3 hover:bg-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${agent.status === 'online' ? 'bg-green-500' : agent.status === 'processing' ? 'bg-yellow-500 animate-pulse' : agent.status === 'error' ? 'bg-red-500' : 'bg-gray-500'}`}></div>
                          <span className="text-sm text-white">{agent.name}</span>
                        </div>
                        <span className="text-xs text-gray-500 font-mono">{agent.confidence}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1">
                        <div 
                          className={`h-1 rounded-full ${agent.confidence > 80 ? 'bg-green-500' : agent.confidence > 60 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                          style={{ width: `${agent.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card className="bg-[#111827] border-white/5">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                <Bell className="h-4 w-4 text-yellow-500" />
                RECENT ALERTS
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {alerts.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <Bell className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                    <p className="text-xs">No alerts</p>
                  </div>
                ) : (
                  alerts.slice(0, 4).map((alert, index) => (
                    <div key={index} className="p-3">
                      <div className="flex items-start gap-2">
                        <div className={`w-2 h-2 rounded-full mt-1.5 ${alert.severity === 'danger' ? 'bg-red-500' : alert.severity === 'warning' ? 'bg-yellow-500' : 'bg-cyan-500'}`}></div>
                        <p className="text-xs text-gray-300">{alert.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-[#111827] border-white/5">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                QUICK ACTIONS
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="text-xs border-white/20 text-gray-300 hover:bg-white/5 hover:text-white bg-transparent justify-start">
                  <Users className="h-3 w-3 mr-1 text-cyan-400" />
                  Copy Trade
                </Button>
                <Button variant="outline" className="text-xs border-white/20 text-gray-300 hover:bg-white/5 hover:text-white bg-transparent justify-start">
                  <BarChart3 className="h-3 w-3 mr-1 text-purple-400" />
                  Analytics
                </Button>
                <Button variant="outline" className="text-xs border-white/20 text-gray-300 hover:bg-white/5 hover:text-white bg-transparent justify-start">
                  <Bot className="h-3 w-3 mr-1 text-pink-400" />
                  AI Agents
                </Button>
                <Button variant="outline" className="text-xs border-white/20 text-gray-300 hover:bg-white/5 hover:text-white bg-transparent justify-start">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-400" />
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
