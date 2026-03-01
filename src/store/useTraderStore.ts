import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { traderScraper } from '../services/marketData';

interface Trader {
  traderId: string;
  username: string;
  winRate: number;
  totalVolume: number;
  totalTrades: number;
  avgReturn: number;
  followerCount: number;
  riskScore: number;
  isReliable: boolean;
  lastActive: Date;
  totalPnL: number;
  winCount: number;
  lossCount: number;
}

interface CopyTraderSettings {
  enabled: boolean;
  maxAllocationPerTrade: number; // Percentage (1-100)
  maxDailyTrades: number;
  minWinRate: number; // Minimum win rate to copy (0-100)
  riskTolerance: 'low' | 'medium' | 'high';
  autoStopLoss: boolean;
  stopLossPercent: number;
  autoTakeProfit: boolean;
  takeProfitPercent: number;
  selectedTraderId: string | null;
}

interface CopyTradeActivity {
  id: string;
  traderId: string;
  traderName: string;
  originalTradeId: string;
  amount: number;
  market: string;
  side: 'buy' | 'sell';
  entryPrice: number;
  timestamp: Date;
  status: 'pending' | 'executed' | 'failed';
}

interface TraderStoreState {
  // Traders
  topTraders: Trader[];
  selectedTrader: Trader | null;
  recentTrades: any[];
  
  // Copy trading settings
  copySettings: CopyTraderSettings;
  copyActivities: CopyTradeActivity[];
  
  // Actions
  loadTopTraders: () => Promise<void>;
  loadTraderPerformance: (traderId: string) => Promise<void>;
  selectTrader: (traderId: string) => void;
  updateCopySettings: (settings: Partial<CopyTraderSettings>) => void;
  executeCopyTrade: (amount: number, marketId: string, side: 'buy' | 'sell') => Promise<any>;
  loadCopyActivities: () => void;
}

const useTraderStore = create<TraderStoreState>()(
  devtools((set, get) => ({
    // Initial state
    topTraders: [],
    selectedTrader: null,
    recentTrades: [],
    copySettings: {
      enabled: false,
      maxAllocationPerTrade: 5,
      maxDailyTrades: 20,
      minWinRate: 50,
      riskTolerance: 'medium',
      autoStopLoss: true,
      stopLossPercent: 15,
      autoTakeProfit: true,
      takeProfitPercent: 30,
      selectedTraderId: null
    },
    copyActivities: [],
    
    // Actions
    loadTopTraders: async () => {
      try {
        const recommendations = await traderScraper.getCopyRecommendations(50, 1000, 10);
        
        set({
          topTraders: recommendations.map(trader => ({
            traderId: trader.traderId,
            username: trader.username,
            winRate: trader.winRate,
            totalVolume: trader.totalVolume,
            totalTrades: trader.totalTrades,
            avgReturn: trader.avgReturn,
            followerCount: trader.followerCount,
            riskScore: trader.riskScore,
            isReliable: trader.isReliable,
            lastActive: new Date(),
            totalPnL: trader.totalVolume * (trader.avgReturn / 100),
            winCount: Math.floor(trader.totalTrades * (trader.winRate / 100)),
            lossCount: trader.totalTrades - Math.floor(trader.totalTrades * (trader.winRate / 100))
          }))
        });
      } catch (error) {
        console.error('Failed to load top traders:', error);
      }
    },
    
    loadTraderPerformance: async (traderId: string) => {
      try {
        const performance = await traderScraper.getTraderPerformance(traderId);
        console.log('Trader performance:', performance);
        // Update state if needed
      } catch (error) {
        console.error('Failed to load trader performance:', error);
      }
    },
    
    selectTrader: (traderId: string) => {
      const trader = get().topTraders.find(t => t.traderId === traderId);
      set({ selectedTrader: trader || null });
    },
    
    updateCopySettings: (settings: Partial<CopyTraderSettings>) => {
      set((state) => ({
        copySettings: { ...state.copySettings, ...settings }
      }));
    },
    
    executeCopyTrade: async (amount: number, marketId: string, side: 'buy' | 'sell') => {
      try {
        const { copySettings, selectedTrader, copyActivities } = get();
        
        if (!selectedTrader) {
          return { error: 'No trader selected' };
        }
        
        if (!copySettings.enabled) {
          return { error: 'Copy trading is disabled' };
        }
        
        // Check daily trade limit
        const dailyTrades = copyActivities.filter(a => {
          const today = new Date();
          return a.timestamp.getDate() === today.getDate() &&
                 a.timestamp.getMonth() === today.getMonth();
        }).length;
        
        if (dailyTrades >= copySettings.maxDailyTrades) {
          return { error: 'Daily trade limit reached' };
        }
        
        // Create copy activity record
        const newActivity: CopyTradeActivity = {
          id: Math.random().toString(36).substring(7),
          traderId: selectedTrader.traderId,
          traderName: selectedTrader.username,
          originalTradeId: marketId,
          amount: amount,
          market: selectedTrader.username + ' Trade',
          side: side,
          entryPrice: 0.5, // Placeholder
          timestamp: new Date(),
          status: 'pending'
        };
        
        // Add to activities
        set(state => ({
          copyActivities: [newActivity, ...state.copyActivities]
        }));
        
        // Return success
        return { success: true, activity: newActivity };
        
      } catch (error: any) {
        console.error('Copy trade execution failed:', error);
        return { error: error.message || 'Copy trade failed' };
      }
    },
    
    loadCopyActivities: () => {
      // Load activities from localStorage or server
    }
  }))
);

export default useTraderStore;