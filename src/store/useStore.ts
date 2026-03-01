import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface MarketData {
  id: string;
  name: string;
  currentPrice: number;
  change24h: number;
  volume: number;
}

interface Position {
  id: string;
  marketId: string;
  marketName: string;
  side: 'buy' | 'sell';
  size: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercentage: number;
}

interface AgentStatus {
  id: string;
  name: string;
  status: 'online' | 'processing' | 'error' | 'paused';
  lastActive: Date;
  confidence: number;
}

interface Alert {
  id: string;
  type: 'trade' | 'risk' | 'system' | 'performance';
  severity: 'info' | 'warning' | 'danger';
  message: string;
  timestamp: Date;
  read: boolean;
}

interface DashboardState {
  // Market data
  markets: MarketData[];
  selectedMarket: string | null;
  
  // Trading positions
  positions: Position[];
  portfolioValue: number;
  todayPnL: number;
  totalPnL: number;
  
  // Agent statuses
  agents: AgentStatus[];
  
  // Alerts and notifications
  alerts: Alert[];
  
  // UI state
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
  
  // Actions
  selectMarket: (marketId: string) => void;
  updateMarketData: (markets: MarketData[]) => void;
  updatePositions: (positions: Position[]) => void;
  updateAgents: (agents: AgentStatus[]) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'read'>) => void;
  markAlertAsRead: (alertId: string) => void;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
}

const useStore = create<DashboardState>()(
  devtools((set, get) => ({
    // Initial state
    markets: [],
    selectedMarket: null,
    positions: [],
    portfolioValue: 0,
    todayPnL: 0,
    totalPnL: 0,
    agents: [],
    alerts: [],
    isSidebarCollapsed: false,
    isDarkMode: true,
    
    // Actions
    selectMarket: (marketId) => set({ selectedMarket: marketId }),
    
    updateMarketData: (markets) => set({ markets }),
    
    updatePositions: (positions) => {
      const portfolioValue = positions.reduce((sum, pos) => sum + pos.size * pos.currentPrice, 0);
      const todayPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0);
      const totalPnL = positions.reduce((sum, pos) => sum + (pos.pnlPercentage * pos.size / 100), 0);
      
      set({ positions, portfolioValue, todayPnL, totalPnL });
    },
    
    updateAgents: (agents) => set({ agents }),
    
    addAlert: (alert) => set((state) => ({
      alerts: [{
        id: Math.random().toString(36).substring(7),
        timestamp: new Date(),
        read: false,
        ...alert
      }, ...state.alerts.slice(0, 99)] // Keep only last 100 alerts
    })),
    
    markAlertAsRead: (alertId) => set((state) => ({
      alerts: state.alerts.map(alert => 
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    })),
    
    toggleSidebar: () => set((state) => ({ 
      isSidebarCollapsed: !state.isSidebarCollapsed 
    })),
    
    toggleDarkMode: () => set((state) => ({ 
      isDarkMode: !state.isDarkMode 
    })),
  }))
);

export default useStore;