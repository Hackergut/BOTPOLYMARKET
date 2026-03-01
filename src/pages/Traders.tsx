import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Wallet, Zap, TrendingUp, Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import useWallet from '../hooks/useWallet';
import useTraderStore from '../store/useTraderStore';
import { formatCurrency, formatPercent } from '../lib/utils';

const TradersPage: React.FC = () => {
  const { isConnected, address, connectWallet, disconnectWallet } = useWallet();
  const { 
    topTraders, 
    selectedTrader, 
    copySettings, 
    updateCopySettings,
    executeCopyTrade,
    loadTopTraders 
  } = useTraderStore();
  
  const [selectedTraderId, setSelectedTraderId] = useState<string | null>(null);
  const [copyAmount, setCopyAmount] = useState<number>(100);
  const [isCopying, setIsCopying] = useState(false);
  
  // Load top traders when component mounts
  useEffect(() => {
    if (isConnected) {
      loadTopTraders();
    }
  }, [isConnected, loadTopTraders]);
  
  // Load traders when connected
  useEffect(() => {
    if (isConnected && topTraders.length === 0) {
      loadTopTraders();
    }
  }, [isConnected, topTraders.length, loadTopTraders]);
  
  const handleCopyTrade = async () => {
    if (!selectedTraderId) {
      alert('Please select a trader to copy');
      return;
    }
    
    setIsCopying(true);
    try {
      const result = await executeCopyTrade(
        copyAmount,
        selectedTraderId,
        'buy'
      );
      
      if (result.success) {
        alert('Copy trade submitted successfully!');
        setCopyAmount(100);
      } else {
        alert(`Failed: ${result.error}`);
      }
    } catch (error) {
      alert('Copy trade failed');
    } finally {
      setIsCopying(false);
    }
  };
  
  const handleSelectTrader = (traderId: string) => {
    setSelectedTraderId(traderId);
    useTraderStore.getState().selectTrader(traderId);
  };
  
  const selectedTraderData = useTraderStore.getState().topTraders.find(
    t => t.traderId === selectedTraderId
  );
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Traders</h1>
          <p className="text-muted-foreground">Follow top performing traders on Polymarket</p>
        </div>
        
        {!isConnected ? (
          <Button variant="primary" onClick={connectWallet}>
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border">
              <Wallet className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={disconnectWallet}>
              Disconnect
            </Button>
          </div>
        )}
      </div>
      
      {/* Copy Trading Toggle */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Copy Trading Settings</CardTitle>
            <Button 
              variant={copySettings.enabled ? "success" : "outline"}
              size="sm"
              onClick={() => updateCopySettings({ enabled: !copySettings.enabled })}
            >
              {copySettings.enabled ? 'ON' : 'OFF'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${copySettings.enabled ? 'bg-success/10' : 'bg-muted/50'}`}>
                <Zap className={`h-6 w-6 ${copySettings.enabled ? 'text-success' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <p className="font-medium">Copy Trading</p>
                <p className="text-sm text-muted-foreground">
                  {copySettings.enabled 
                    ? 'Automatically copy trades from selected traders' 
                    : 'Copy trading is disabled'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Top Traders List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {topTraders.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">
              {isConnected 
                ? 'Loading top traders...' 
                : 'Connect your wallet to see top traders'}
            </p>
            {!isConnected && (
              <Button variant="outline" className="mt-4" onClick={connectWallet}>
                Connect Wallet
              </Button>
            )}
          </div>
        ) : (
          topTraders.map((trader) => (
            <Card 
              key={trader.traderId}
              className={`cursor-pointer hover:shadow-lg transition-shadow ${
                selectedTraderId === trader.traderId ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleSelectTrader(trader.traderId)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{trader.username}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(trader.totalVolume)} volume • 
                      {trader.totalTrades} trades
                    </p>
                  </div>
                  <Badge variant={trader.isReliable ? 'success' : 'default'}>
                    {trader.isReliable ? 'Reliable' : 'New'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Win Rate</span>
                    <span className={`text-lg font-bold ${trader.winRate >= 60 ? 'text-success' : 'text-muted-foreground'}`}>
                      {trader.winRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Avg Return</span>
                    <span className={`text-lg font-bold ${trader.avgReturn > 0 ? 'text-success' : 'text-destructive'}`}>
                      {trader.avgReturn > 0 ? '+' : ''}{trader.avgReturn.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Followers</span>
                    <span className="text-lg font-bold">
                      {trader.followerCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Risk Score</span>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold">
                        {trader.riskScore}/10
                      </span>
                      <AlertTriangle className="h-3 w-3 text-warning" />
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="primary" 
                  className="w-full mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTrader(trader.traderId);
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy This Trader
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      {/* Copy Configuration */}
      {selectedTraderId && selectedTraderData && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Copy Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
                {selectedTraderData.username[0].toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-lg">{selectedTraderData.username}</p>
                <p className="text-sm text-muted-foreground">
                  Win Rate: {selectedTraderData.winRate.toFixed(1)}% • 
                  {selectedTraderData.totalTrades} trades
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Copy Amount (USDC)</label>
                <div className="mt-1 flex items-center">
                  <input
                    type="number"
                    value={copyAmount}
                    onChange={(e) => setCopyAmount(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Enter amount"
                    disabled={!copySettings.enabled}
                  />
                  <span className="ml-2 text-sm text-muted-foreground">USDC</span>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {[1, 5, 10, 25].map((percent) => (
                  <Button
                    key={percent}
                    variant="outline"
                    size="sm"
                    onClick={() => setCopyAmount(1000 * (percent / 100))}
                    disabled={!copySettings.enabled}
                  >
                    {percent}%
                  </Button>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className={`h-5 w-5 mr-2 ${copySettings.enabled ? 'text-success' : 'text-muted-foreground'}`} />
                  <span>Copy trades automatically</span>
                </div>
                <Button 
                  variant={copySettings.enabled ? "success" : "outline"}
                  size="sm"
                  onClick={() => updateCopySettings({ enabled: !copySettings.enabled })}
                  disabled={copySettings.enabled && !copyAmount}
                >
                  Start Copying
                </Button>
              </div>
              
              <Button 
                variant="primary" 
                className="w-full"
                onClick={handleCopyTrade}
                disabled={!copySettings.enabled || !copyAmount}
              >
                {isCopying ? 'Copying...' : 'Execute Copy Trade'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TradersPage;