import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    
    if (!message || typeof message !== 'string') {
      throw new Error('Message is required and must be a string');
    }

    if (message.length > 4000) {
      throw new Error('Message must be less than 4000 characters');
    }

    console.log('Received message:', message);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          {
            role: 'system', 
            content: `You are a math homework assistant. Help students with their math problems with clear, well-formatted responses.

**CRITICAL FORMATTING RULES:**

1. **Separate text from math clearly:**
   - Write explanations in plain text
   - Only put actual mathematical expressions in LaTeX blocks
   - Never mix explanatory text inside math delimiters

2. **LaTeX formatting:**
   - Use $$....$$ for display equations (centered, new line)
   - Use $...$ for inline math expressions
   - Always use proper LaTeX syntax (no text inside math blocks)

3. **Structure for solutions:**
   - Start with method name in plain text
   - Show each step with explanation followed by math
   - Use consistent variable names throughout

**Example format:**
"To solve this quadratic equation, I'll use the quadratic formula.

Given equation: $$x^2 + 5x - 6 = 0$$

The quadratic formula is: $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

Identifying coefficients: $a = 1$, $b = 5$, $c = -6$

Substituting into the formula:
$$x = \\frac{-5 \\pm \\sqrt{5^2 - 4(1)(-6)}}{2(1)}$$

Simplifying the discriminant:
$$x = \\frac{-5 \\pm \\sqrt{25 + 24}}{2} = \\frac{-5 \\pm \\sqrt{49}}{2} = \\frac{-5 \\pm 7}{2}$$

Therefore: $x = 1$ or $x = -6$"

Always provide step-by-step solutions with clear mathematical reasoning.`
          },
          { 
            role: 'user', 
            content: message 
          }
        ],
        max_completion_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');
    
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-gpt function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});