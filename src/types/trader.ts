export interface Trader {
  id: string;
  username: string;
  avatar?: string;
  totalTrades: number;
  winRate: number;
  totalPnL: number;
  avgReturn: number;
  riskScore: number; // 1-10 scale
  marketsTraded: string[];
  lastActive: Date;
  followerCount: number;
  isFollowing: boolean;
}

export interface Trade {
  id: string;
  traderId: string;
  marketId: string;
  marketName: string;
  side: 'buy' | 'sell';
  amount: number;
  entryPrice: number;
  exitPrice?: number;
  pnl: number;
  timestamp: Date;
  status: 'open' | 'closed' | 'copied';
}

export interface CopyTradeSettings {
  enabled: boolean;
  maxAllocationPerTrade: number; // Percentage of portfolio
  maxDailyTrades: number;
  minWinRate: number; // Minimum win rate to copy
  riskTolerance: 'low' | 'medium' | 'high';
  autoStopLoss: boolean;
  stopLossPercent: number;
  autoTakeProfit: boolean;
  takeProfitPercent: number;
}

export interface CopyTradeActivity {
  id: string;
  traderId: string;
  originalTradeId: string;
  copiedTradeId: string;
  amount: number;
  timestamp: Date;
  status: 'pending' | 'executed' | 'failed';
  reason?: string;
}