import { createClient } from 'npm:@insforge/sdk';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// Mock top traders data - in production, this would scrape from Polymarket
const MOCK_TRADERS = [
  { trader_id: '0x1234...', username: 'CryptoKing', win_rate: 68.5, total_volume: 250000, total_trades: 450, avg_return: 12.3, follower_count: 1250, risk_score: 0.65, is_reliable: true },
  { trader_id: '0x5678...', username: 'PolymarketPro', win_rate: 72.1, total_volume: 180000, total_trades: 320, avg_return: 15.8, follower_count: 890, risk_score: 0.55, is_reliable: true },
  { trader_id: '0x9abc...', username: 'SignalMaster', win_rate: 65.3, total_volume: 320000, total_trades: 580, avg_return: 9.2, follower_count: 2100, risk_score: 0.75, is_reliable: false },
  { trader_id: '0xdef0...', username: 'MarketWhisperer', win_rate: 78.9, total_volume: 95000, total_trades: 180, avg_return: 22.5, follower_count: 560, risk_score: 0.45, is_reliable: true },
  { trader_id: '0x1122...', username: 'ThetaTrader', win_rate: 61.2, total_volume: 420000, total_trades: 720, avg_return: 8.1, follower_count: 3200, risk_score: 0.80, is_reliable: false },
];

export default async function(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const client = createClient({
    baseUrl: Deno.env.get('INSFORGE_BASE_URL'),
    anonKey: Deno.env.get('ANON_KEY')
  });

  try {
    // Get limit from query params
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');

    // Try to fetch from database first
    const { data: dbTraders, error } = await client.database
      .from('traders')
      .select('*')
      .order('total_volume', { ascending: false })
      .limit(limit);

    if (error || !dbTraders || dbTraders.length === 0) {
      // Use mock data if no data in DB
      const tradersToReturn = MOCK_TRADERS.slice(0, limit);
      
      // Optionally sync to DB
      for (const trader of tradersToReturn) {
        await client.database.from('traders').upsert([{
          trader_id: trader.trader_id,
          username: trader.username,
          win_rate: trader.win_rate,
          total_volume: trader.total_volume,
          total_trades: trader.total_trades,
          avg_return: trader.avg_return,
          follower_count: trader.follower_count,
          risk_score: trader.risk_score,
          is_reliable: trader.is_reliable,
          last_active: new Date().toISOString()
        }], { onConflict: 'trader_id' });
      }

      return new Response(JSON.stringify({ traders: tradersToReturn, source: 'sync' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ traders: dbTraders, source: 'database' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching traders:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch traders' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
