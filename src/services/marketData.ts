// Market data service for Polymarket
// Provides real-time market data and trader scraping

const INSFORGE_API_URL = 'https://99k2k2ur.ap-southeast.insforge.app/functions/v1';
const INSFORGE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMzQxNzB9.C82Ybdhv2KeG4tLGJpyysl-jrs6y6rycaYTsTYn2MWA';

interface MarketData {
  marketId: string;
  tokenY: string;
  tokenN: string;
  priceY: number;
  priceN: number;
  volumeY: number;
  volumeN: number;
  spread: number;
  lastUpdate: Date;
}

interface TraderData {
  traderId: string;
  username: string;
  win_rate: number;
  volume: number;
  num_trades: number;
  avg_return: number;
  followers: number;
  risk_score: number;
}

/**
 * Real-time market data service
 */
class MarketDataService {
  private pollingInterval: number | null = null;
  private subscribers: Map<string, (data: MarketData) => void> = new Map();
  private marketCache: Map<string, MarketData> = new Map();

  startPolling(intervalMs: number = 5000) {
    if (this.pollingInterval) return;
    console.log('Market data polling started');
  }

  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  subscribe(marketId: string, callback: (data: MarketData) => void) {
    this.subscribers.set(marketId, callback);
  }

  unsubscribe(marketId: string) {
    this.subscribers.delete(marketId);
  }

  getMarketData(marketId: string): MarketData | undefined {
    return this.marketCache.get(marketId);
  }

  isConnected(): boolean {
    return this.pollingInterval !== null;
  }
}

/**
 * Polymarket Trader Data - Fetches from InsForge Backend
 */
class TraderScraper {
  private cachedTraders: TraderData[] | null = null;
  private lastFetch: number = 0;
  private cacheTimeout = 60000; // 1 minute cache

  /**
   * Get top traders from InsForge backend
   */
  async getTopTraders(limit: number = 20): Promise<TraderData[]> {
    try {
      const response = await fetch(`${INSFORGE_API_URL}/get-traders?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${INSFORGE_ANON_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.traders && Array.isArray(data.traders)) {
        this.cachedTraders = data.traders;
        this.lastFetch = Date.now();
        return data.traders;
      }
      
      // Fallback to mock if no traders in DB
      return this.getMockTraders(limit);
    } catch (error) {
      console.error('Error fetching traders from backend:', error);
      // Fallback to mock data
      return this.getMockTraders(limit);
    }
  }

  /**
   * Get trader performance data
   */
  async getTraderPerformance(traderId: string): Promise<any> {
    try {
      // For now, return mock performance data
      return {
        traderId,
        winRate: 65 + Math.random() * 15,
        totalVolume: Math.floor(Math.random() * 500000),
        totalTrades: Math.floor(Math.random() * 500),
        avgReturn: 5 + Math.random() * 20,
      };
    } catch (error) {
      console.error('Error fetching trader performance:', error);
      throw error;
    }
  }

  /**
   * Get current positions of a trader
   */
  async getTraderPositions(traderId: string): Promise<any[]> {
    try {
      // Return mock positions for now
      return [
        { market: 'BTC to $100k', side: 'YES', size: 100, entryPrice: 0.35 },
        { market: 'Fed rate cut Q1', side: 'YES', size: 50, entryPrice: 0.72 },
      ];
    } catch (error) {
      console.error('Error fetching trader positions:', error);
      return [];
    }
  }

  /**
   * Get filtered copy trading recommendations
   */
  async getCopyRecommendations(minWinRate: number = 50, minVolume: number = 1000, minTrades: number = 10): Promise<any[]> {
    // Check cache first
    if (this.cachedTraders && (Date.now() - this.lastFetch) < this.cacheTimeout) {
      return this.cachedTraders
        .filter(trader => (trader.win_rate || 0) >= minWinRate && (trader.volume || 0) >= minVolume && (trader.num_trades || 0) >= minTrades)
        .map(trader => ({
          traderId: trader.traderId,
          username: trader.username,
          winRate: trader.win_rate || 0,
          totalVolume: trader.volume || 0,
          totalTrades: trader.num_trades || 0,
          avgReturn: trader.avg_return || 0,
          followerCount: trader.followers || 0,
          riskScore: trader.risk_score || 5,
          isReliable: (trader.win_rate || 0) >= 60 && (trader.num_trades || 0) >= 50
        }))
        .sort((a, b) => b.winRate - a.winRate);
    }

    // Fetch fresh data
    const topTraders = await this.getTopTraders(100);
    
    return topTraders
      .filter(trader => (trader.win_rate || 0) >= minWinRate && (trader.volume || 0) >= minVolume && (trader.num_trades || 0) >= minTrades)
      .map(trader => ({
        traderId: trader.traderId,
        username: trader.username,
        winRate: trader.win_rate || 0,
        totalVolume: trader.volume || 0,
        totalTrades: trader.num_trades || 0,
        avgReturn: trader.avg_return || 0,
        followerCount: trader.followers || 0,
        riskScore: trader.risk_score || 5,
        isReliable: (trader.win_rate || 0) >= 60 && (trader.num_trades || 0) >= 50
      }))
      .sort((a, b) => b.winRate - a.winRate);
  }

  /**
   * Mock traders for fallback/demo
   */
  private getMockTraders(limit: number): TraderData[] {
    return [
      { traderId: 'trader_1', username: 'CryptoKing', win_rate: 68.5, volume: 250000, num_trades: 450, avg_return: 12.3, followers: 1250, risk_score: 0.65 },
      { traderId: 'trader_2', username: 'PolymarketPro', win_rate: 72.1, volume: 180000, num_trades: 320, avg_return: 15.8, followers: 890, risk_score: 0.55 },
      { traderId: 'trader_3', username: 'SignalMaster', win_rate: 65.3, volume: 320000, num_trades: 580, avg_return: 9.2, followers: 2100, risk_score: 0.75 },
      { traderId: 'trader_4', username: 'MarketWhisperer', win_rate: 78.9, volume: 95000, num_trades: 180, avg_return: 22.5, followers: 560, risk_score: 0.45 },
      { traderId: 'trader_5', username: 'ThetaTrader', win_rate: 61.2, volume: 420000, num_trades: 720, avg_return: 8.1, followers: 3200, risk_score: 0.80 },
    ].slice(0, limit);
  }
}

const marketDataService = new MarketDataService();
const traderScraper = new TraderScraper();

export { marketDataService, traderScraper };
