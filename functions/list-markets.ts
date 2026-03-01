// Get all markets with optional filters
Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const limit = url.searchParams.get('limit') || '20';
    const active = url.searchParams.get('active') || 'true';

    // Fetch from Polymarket CLOB API
    const response = await fetch(
      `https://clob.polymarket.com/markets?active=${active}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform to our API format
    const markets = (data.markets || []).map((market: any) => ({
      id: market.conditionId,
      question: market.question,
      description: market.description,
      volume: market.volume,
      liquidity: market.liquidity,
      volume24h: market.volume24hr,
      price: market.price || 0.5,
      change24h: market.change24hr || 0,
      active: market.active,
      closed: market.closed,
      endDate: market.endDate,
      createdAt: market.createdAt
    }));

    return new Response(JSON.stringify({ markets }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
