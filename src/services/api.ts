// API Client for Polymarket Trading Bot - InsForge Backend Integration
import { createClient } from '@insforge/sdk';

// InsForge configuration
const INSFORGE_BASE_URL = 'https://99k2k2ur.ap-southeast.insforge.app';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMzQxNzB9.C82Ybdhv2KeG4tLGJpyysl-jrs6y6rycaYTsTYn2MWA';

// Create InsForge client
export const insforge = createClient({
  baseUrl: INSFORGE_BASE_URL,
  anonKey: ANON_KEY
});

const getAuthToken = (): string | null => localStorage.getItem('insforge_token');
const API_BASE_URL = `${INSFORGE_BASE_URL}/functions/v1`;

interface ApiResponse<T> { data: T | null; error: Error | null; }

export const marketApi = {
  getMarkets: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/sync-markets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ANON_KEY}` }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return { data: data.markets || [], error: null };
    } catch (error) {
      console.error('Error fetching markets:', error);
      return { data: null, error: error as Error };
    }
  }
};

export const traderApi = {
  getTopTraders: async (limit: number = 10): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/get-traders?limit=${limit}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ANON_KEY}` }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return { data: data.traders || [], error: null };
    } catch (error) { return { data: null, error: error as Error }; }
  },
  executeTrade: async (tradeData: { token_id: string; side: 'buy' | 'sell'; amount: number; price?: number; market_name?: string; }): Promise<ApiResponse<any>> => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/execute-trade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : `Bearer ${ANON_KEY}` },
        body: JSON.stringify(tradeData)
      });
      if (!response.ok) { const error = await response.json(); throw new Error(error.error || `HTTP error! status: ${response.status}`); }
      return { data: await response.json(), error: null };
    } catch (error) { return { data: null, error: error as Error }; }
  },
  copyTrade: async (tradeData: { trader_id: string; token_id: string; side: 'buy' | 'sell'; amount: number; price?: number; market_name?: string; }): Promise<ApiResponse<any>> => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/copy-trade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : `Bearer ${ANON_KEY}` },
        body: JSON.stringify(tradeData)
      });
      if (!response.ok) { const error = await response.json(); throw new Error(error.error || `HTTP error! status: ${response.status}`); }
      return { data: await response.json(), error: null };
    } catch (error) { return { data: null, error: error as Error }; }
  }
};

export const aiApi = {
  analyzeMarket: async (marketData: { market_question: string; current_price?: number; volume?: number; liquidity?: number; sentiment?: string; }): Promise<ApiResponse<any>> => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/analyze-market`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : `Bearer ${ANON_KEY}` },
        body: JSON.stringify(marketData)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return { data: data.analysis || null, error: null };
    } catch (error) { return { data: null, error: error as Error }; }
  }
};

export const auth = {
  signInWithGitHub: async () => { try { const { data, error } = await insforge.auth.signInWithOAuth({ provider: 'github' }); return { data, error }; } catch (error) { return { data: null, error: error as Error }; } },
  signInWithGoogle: async () => { try { const { data, error } = await insforge.auth.signInWithOAuth({ provider: 'google' }); return { data, error }; } catch (error) { return { data: null, error: error as Error }; } },
  signOut: async () => { try { const { error } = await insforge.auth.signOut(); localStorage.removeItem('insforge_token'); return { error }; } catch (error) { return { error: error as Error }; } },
  getCurrentUser: async () => { try { const { data, error } = await insforge.auth.getCurrentUser(); return { data, error }; } catch (error) { return { data: null, error: error as Error }; } }
};

export default insforge;
