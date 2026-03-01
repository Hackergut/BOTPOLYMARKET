import { createClient } from 'npm:@insforge/sdk';

const POLYMARKET_API = 'https://clob.polymarket.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export default async function(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const client = createClient({
    baseUrl: Deno.env.get('INSFORGE_BASE_URL'),
    anonKey: Deno.env.get('ANON_KEY')
  });

  try {
    // Fetch markets from Polymarket API
    const response = await fetch(`${POLYMARKET_API}/markets?active=true&closed=false&limit=50`);
    const data = await response.json();

    if (!data.markets || data.markets.length === 0) {
      return new Response(JSON.stringify({ markets: [] }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Transform markets to our format
    const markets = data.markets.map((market: any) => ({
      condition_id: market.conditionId,
      question: market.question,
      description: market.description,
      volume: market.volume || 0,
      liquidity: market.liquidity || 0,
      active: market.active,
      closed: market.closed,
      end_date: market.endDate || null,
      image: market.image || null,
      url: market.url || null,
      updated_at: new Date().toISOString()
    }));

    return new Response(JSON.stringify({ markets, count: markets.length }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching markets:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch markets' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
