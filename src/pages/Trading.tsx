import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  TrendingUp, 
  TrendingDown, 
  ChevronUp, 
  ChevronDown,
  BarChart3,
  BookOpen,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Zap
} from 'lucide-react';
import { formatCurrency, formatPercent } from '../lib/utils';

const Trading: React.FC = () => {
  const [selectedMarket, setSelectedMarket] = useState<string>('1');
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState<number>(100);
  const [price, setPrice] = useState<number>(0.65);
  const [stopPrice, setStopPrice] = useState<number>(0.60);
  
  // Mock market data
  const markets = [
    { id: '1', name: 'Will BTC reach $100k by EOY?', currentPrice: 0.65, change24h: 2.5, volume: 125000 },
    { id: '2', name: 'Will Trump win 2024 election?', currentPrice: 0.42, change24h: -1.2, volume: 87500 },
    { id: '3', name: 'Will Fed cut rates in 2024?', currentPrice: 0.78, change24h: 3.1, volume: 210000 },
  ];
  
  const orderBook = {
    bids: [
      { price: 0.64, size: 1250 },
      { price: 0.63, size: 875 },
      { price: 0.62, size: 2100 },
      { price: 0.61, size: 950 },
      { price: 0.60, size: 1425 },
    ],
    asks: [
      { price: 0.66, size: 980 },
      { price: 0.67, size: 1650 },
      { price: 0.68, size: 725 },
      { price: 0.69, size: 1300 },
      { price: 0.70, size: 850 },
    ]
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle trade submission
    console.log('Submitting trade:', { selectedMarket, orderType, side, amount, price, stopPrice });
  };
  
  const selectedMarketData = markets.find(market => market.id === selectedMarket) || markets[0];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Trading</h1>
          <p className="text-muted-foreground">Execute trades and manage your positions</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="success" size="sm">
            <Play className="h-4 w-4 mr-1" />
            Start Bot
          </Button>
          <Button variant="destructive" size="sm">
            <Pause className="h-4 w-4 mr-1" />
            Pause
          </Button>
          <Button variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </div>
      
      {/* Trading Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Selection and Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Market Selector */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                {markets.map((market) => (
                  <Button
                    key={market.id}
                    variant={selectedMarket === market.id ? "secondary" : "outline"}
                    onClick={() => setSelectedMarket(market.id)}
                    className="flex-1 min-w-[200px] justify-between"
                  >
                    <span>{market.name}</span>
                    <Badge variant={market.change24h >= 0 ? "success" : "destructive"}>
                      {market.change24h >= 0 ? '+' : ''}{market.change24h.toFixed(2)}%
                    </Badge>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Chart Placeholder */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{selectedMarketData.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold">{selectedMarketData.currentPrice.toFixed(3)}</span>
                  <Badge variant={selectedMarketData.change24h >= 0 ? "success" : "destructive"}>
                    {selectedMarketData.change24h >= 0 ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    {Math.abs(selectedMarketData.change24h).toFixed(2)}%
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Interactive chart would be displayed here</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Order Book */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Order Book
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {/* Asks */}
                <div>
                  <h3 className="text-sm font-medium text-destructive mb-2">Sell Orders</h3>
                  <div className="space-y-1">
                    {orderBook.asks.map((ask, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-destructive">{ask.price.toFixed(3)}</span>
                        <span>{ask.size.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Bids */}
                <div>
                  <h3 className="text-sm font-medium text-success mb-2">Buy Orders</h3>
                  <div className="space-y-1">
                    {orderBook.bids.map((bid, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-success">{bid.price.toFixed(3)}</span>
                        <span>{bid.size.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Trading Panel */}
        <div className="space-y-6">
          {/* Trade Entry Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Execute Trade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Side Selection */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={side === 'buy' ? "success" : "outline"}
                    onClick={() => setSide('buy')}
                  >
                    BUY
                  </Button>
                  <Button
                    type="button"
                    variant={side === 'sell' ? "destructive" : "outline"}
                    onClick={() => setSide('sell')}
                  >
                    SELL
                  </Button>
                </div>
                
                {/* Order Type */}
                <div>
                  <label className="text-sm font-medium">Order Type</label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <Button
                      type="button"
                      variant={orderType === 'market' ? "secondary" : "outline"}
                      onClick={() => setOrderType('market')}
                      size="sm"
                    >
                      Market
                    </Button>
                    <Button
                      type="button"
                      variant={orderType === 'limit' ? "secondary" : "outline"}
                      onClick={() => setOrderType('limit')}
                      size="sm"
                    >
                      Limit
                    </Button>
                    <Button
                      type="button"
                      variant={orderType === 'stop' ? "secondary" : "outline"}
                      onClick={() => setOrderType('stop')}
                      size="sm"
                    >
                      Stop
                    </Button>
                  </div>
                </div>
                
                {/* Amount */}
                <div>
                  <label className="text-sm font-medium">Amount (USDC)</label>
                  <div className="mt-1 relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-muted-foreground text-sm">USDC</span>
                    </div>
                  </div>
                </div>
                
                {/* Price (for limit and stop orders) */}
                {(orderType === 'limit' || orderType === 'stop') && (
                  <div>
                    <label className="text-sm font-medium">
                      {orderType === 'limit' ? 'Limit Price' : 'Stop Price'}
                    </label>
                    <div className="mt-1 relative">
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        placeholder="0.000"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-muted-foreground text-sm">YES</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Stop Price (for stop orders) */}
                {orderType === 'stop' && (
                  <div>
                    <label className="text-sm font-medium">Limit Price</label>
                    <div className="mt-1 relative">
                      <input
                        type="number"
                        value={stopPrice}
                        onChange={(e) => setStopPrice(Number(e.target.value))}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        placeholder="0.000"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-muted-foreground text-sm">YES</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Submit Button */}
                <Button 
                  type="submit" 
                  variant={side === 'buy' ? "success" : "destructive"}
                  className="w-full"
                >
                  {side === 'buy' ? 'BUY' : 'SELL'} {selectedMarketData.name.split(' ')[1] || 'Shares'}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Position Sizing */}
          <Card>
            <CardHeader>
              <CardTitle>Position Sizing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Portfolio Value</span>
                    <span>{formatCurrency(12540.75)}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(amount / 12540.75) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {((amount / 12540.75) * 100).toFixed(2)}% of portfolio
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {[1, 5, 10, 25].map((percent) => (
                    <Button
                      key={percent}
                      variant="outline"
                      size="sm"
                      onClick={() => setAmount(12540.75 * (percent / 100))}
                    >
                      {percent}%
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Risk Indicators */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Position Risk</span>
                  <Badge variant="warning">Medium</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Market Volatility</span>
                  <Badge variant="success">Low</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Leverage</span>
                  <Badge variant="default">1.0x</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Drawdown</span>
                  <Badge variant="success">-2.3%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Trading;