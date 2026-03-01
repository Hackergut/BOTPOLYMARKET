// Get market trades
Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const marketId = pathParts[pathParts.length - 1];

    if (!marketId) {
      return new Response(JSON.stringify({ error: 'Market ID required' }), { status: 400 });
    }

    const response = await fetch(
      `https://clob.polymarket.com/markets/${marketId}/trades`
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const trades = await response.json();

    return new Response(JSON.stringify({ trades }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
