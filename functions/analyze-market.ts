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
    const { market_question, current_price, volume, liquidity, sentiment } = body;

    if (!market_question) {
      return new Response(JSON.stringify({ error: 'Missing market question' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get AI analysis
    const prompt = `Analyze this Polymarket prediction market and provide trading insights:

Market: ${market_question}
Current Price: ${current_price || 'N/A'}
Volume: ${volume || 'N/A'}
Liquidity: ${liquidity || 'N/A'}
Sentiment: ${sentiment || 'neutral'}

Provide a JSON response with:
{
  "recommendation": "buy" | "sell" | "hold",
  "confidence": 0-100,
  "reasoning": "brief explanation",
  "risk_level": "low" | "medium" | "high",
  "suggested_position_size": "1-10% of portfolio"
}`;

    const { data: aiResponse, error: aiError } = await client.ai.chat.completions.create({
      model: 'deepseek/deepseek-v3.2',
      messages: [
        { role: 'system', content: 'You are a professional trading analyst specializing in prediction markets. Provide concise, actionable insights.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    if (aiError) {
      console.error('AI error:', aiError);
      return new Response(JSON.stringify({ error: 'AI analysis failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const analysis = aiResponse?.choices?.[0]?.message?.content || '';
    
    // Try to parse JSON from response
    let parsedAnalysis;
    try {
      const jsonMatch = analysis.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedAnalysis = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      parsedAnalysis = { 
        recommendation: 'hold', 
        confidence: 50, 
        reasoning: analysis.substring(0, 200),
        risk_level: 'medium'
      };
    }

    return new Response(JSON.stringify({ 
      success: true, 
      analysis: parsedAnalysis,
      raw_analysis: analysis
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in AI analysis:', error);
    return new Response(JSON.stringify({ error: 'Failed to analyze market' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
