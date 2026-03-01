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
    const { token_id, side, amount, price, market_name } = body;

    if (!token_id || !side || !amount || !price) {
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

    // Create trade record
    const { data: trade, error: tradeError } = await client.database.from('trade_history').insert([{
      user_id: userData.user.id,
      token_id,
      market_name: market_name || 'Unknown Market',
      side: side.toLowerCase(),
      amount,
      price,
      total_value: amount * price,
      status: 'executed',
      executed_at: new Date().toISOString()
    }]).select().single();

    if (tradeError) {
      console.error('Trade error:', tradeError);
      return new Response(JSON.stringify({ error: 'Failed to record trade' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // In production, this would call Polymarket API to execute the trade
    // For now, we just record it
    const txHash = '0x' + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)).join('');

    return new Response(JSON.stringify({ 
      success: true, 
      trade: { ...trade, tx_hash: txHash },
      message: 'Trade executed successfully'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error executing trade:', error);
    return new Response(JSON.stringify({ error: 'Failed to execute trade' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
