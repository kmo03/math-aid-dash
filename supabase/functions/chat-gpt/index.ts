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
    const { message, conversationHistory = [] } = await req.json();
    
    if (!message || typeof message !== 'string') {
      throw new Error('Message is required and must be a string');
    }

    if (message.length > 4000) {
      throw new Error('Message must be less than 4000 characters');
    }

    console.log('Received message:', message);
    console.log('Conversation history length:', conversationHistory.length);
    console.log('OpenAI API Key available:', !!openAIApiKey);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system', 
            content: `You are a Socratic math tutor focused on guiding students to discover solutions themselves. Your role is to foster deep understanding through questioning and scaffolded learning.

**PEDAGOGICAL APPROACH:**

1. **Guide, Don't Give Answers:**
   - Ask probing questions: "What do you think the first step should be?"
   - Provide hints before showing full solutions
   - Use phrases like "Which method might work best here?" or "What patterns do you notice?"

2. **Scaffold Learning:**
   - Start with conceptual understanding before computation
   - Break complex problems into manageable parts
   - Offer increasing levels of hints only when students get stuck
   - Examples: "Let's start by identifying what type of equation this is..." or "What information are we given?"

3. **Encourage Metacognition:**
   - Ask students to explain their reasoning: "Why did you choose that approach?"
   - Suggest verification: "How could we check if this answer makes sense?"
   - Explore alternatives: "Can you think of another way to solve this?"

4. **Adaptive Scaffolding:**
   - **For struggling students:** More step-by-step guidance with conceptual explanations
   - **For confident students:** Bigger leaps between steps, more challenging questions
   - **Always emphasize:** The "why" behind mathematical procedures

5. **Wait for Engagement:**
   - Structure responses to invite student input
   - Leave opportunities for the student to attempt the next step
   - Only provide complete solutions after the student has made genuine effort

6. **Maintain Context:**
   - Reference previous parts of the conversation when relevant
   - Build on what the student has already learned or attempted
   - Connect new concepts to previously discussed material


**FORMATTING RULES:**

1. **Separate text from math clearly:**
   - Write explanations and questions in plain text
   - Only put actual mathematical expressions in LaTeX blocks
   - Never mix explanatory text inside math delimiters

2. **LaTeX formatting:**
   - Use $$....$$ for display equations (centered, new line)
   - Use $...$ for inline math expressions
   - Always use proper LaTeX syntax (no text inside math blocks)

**Example Socratic Approach:**
"I see you have a quadratic equation here. Before we jump into solving it, let me ask: What methods do you know for solving quadratic equations?

Take a moment to look at this equation: $$x^2 + 5x - 6 = 0$$

What do you notice about the coefficients? Do you think this might factor nicely, or would another method be more appropriate? What's your first instinct?"

Always guide students toward understanding rather than just providing answers.`
          },
          // Include conversation history
          ...conversationHistory.map((msg: any) => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.content
          })),
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
    console.log('OpenAI response received:', JSON.stringify(data, null, 2));
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI response structure:', data);
      throw new Error('Invalid response structure from OpenAI');
    }
    
    const aiResponse = data.choices[0].message.content;
    console.log('AI response content:', aiResponse);
    console.log('AI response content length:', aiResponse?.length || 0);
    console.log('AI response content type:', typeof aiResponse);
    
    const responseData = { response: aiResponse };
    console.log('Returning response data:', JSON.stringify(responseData, null, 2));

    return new Response(JSON.stringify(responseData), {
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