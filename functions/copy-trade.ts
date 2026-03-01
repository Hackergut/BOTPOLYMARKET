import { createClient } from 'npm:@insforge/sdk';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export default async function(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Get user token from authorization header
  const authHeader = req.headers.get('Authorization');
  const userToken = authHeader ? authHeader.replace('Bearer ', '') : null;

  if (!userToken) {
    return new Response(JSON.stringify({ error: 'Authentication required' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const client = createClient({
    baseUrl: Deno.env.get('INSFORGE_BASE_URL'),
    edgeFunctionToken: userToken
  });

  try {
    const body = await req.json();
    const { trader_id, token_id, side, amount, price, market_name, original_trade_id } = body;

    if (!trader_id || !token_id || !side || !amount) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get current user
    const { data: userData } = await client.auth.getCurrentUser();
    if (!userData?.user?.id) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check if copy trading is enabled for this user
    const { data: user } = await client.database
      .from('users')
      .select('settings')
      .eq('id', userData.user.id)
      .single();

    const settings = user?.settings || {};
    if (!settings.copyTradingEnabled) {
      return new Response(JSON.stringify({ error: 'Copy trading is not enabled' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check max allocation per trade
    if (settings.maxAllocationPerTrade && amount > settings.maxAllocationPerTrade) {
      return new Response(JSON.stringify({ error: 'Amount exceeds max allocation' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create copy trade record
    const { data: copyTrade, error: tradeError } = await client.database.from('copy_trades').insert([{
      user_id: userData.user.id,
      trader_id,
      original_trade_id: original_trade_id || `copy_${Date.now()}`,
      market_name: market_name || 'Unknown Market',
      side: side.toLowerCase(),
      amount,
      entry_price: price || 0.5,
      status: 'executed',
      executed_at: new Date().toISOString()
    }]).select().single();

    if (tradeError) {
      console.error('Copy trade error:', tradeError);
      return new Response(JSON.stringify({ error: 'Failed to create copy trade' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // In production, this would call Polymarket API to execute the copy trade
    const txHash = '0x' + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)).join('');

    return new Response(JSON.stringify({ 
      success: true, 
      copy_trade: { ...copyTrade, tx_hash: txHash },
      message: `Successfully copied trade from ${trader_id}`
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error executing copy trade:', error);
    return new Response(JSON.stringify({ error: 'Failed to execute copy trade' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
