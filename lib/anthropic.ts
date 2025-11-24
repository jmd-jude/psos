import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function generateInsight(
  systemPrompt: string,
  userPrompt: string,
  model: string = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929'
): Promise<string> {
  try {
    const message = await anthropic.messages.create({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // Extract text content from response
    const textContent = message.content.find(block => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in Anthropic response');
    }

    return textContent.text;
  } catch (error) {
    console.error('Anthropic API error:', error);
    throw new Error('Failed to generate insight');
  }
}

export { anthropic };
