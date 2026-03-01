// Get market details by ID
Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const marketId = pathParts[pathParts.length - 1];

    if (!marketId) {
      return new Response(JSON.stringify({ error: 'Market ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch from Polymarket CLOB API
    const response = await fetch(
      `https://clob.polymarket.com/markets/${marketId}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const market = await response.json();

    // Transform to our API format
    const result = {
      id: market.conditionId,
      question: market.question,
      description: market.description,
      volume: market.volume,
      liquidity: market.liquidity,
      volume24h: market.volume24hr,
      priceYes: market.priceYes || market.price || 0.5,
      priceNo: market.priceNo || (1 - (market.price || 0.5)),
      change24h: market.change24hr || 0,
      active: market.active,
      closed: market.closed,
      endDate: market.endDate,
      createdAt: market.createdAt,
      tokens: market.tokens?.map((t: any) => ({
        tokenId: t.tokenId,
        outcome: t.outcome,
        price: t.price
      })) || []
    };

    return new Response(JSON.stringify({ market: result }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
