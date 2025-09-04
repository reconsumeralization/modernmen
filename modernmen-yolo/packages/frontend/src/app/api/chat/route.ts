import { CoreMessage, streamText } from 'ai';
import { createXai } from '@ai-sdk/xai';

export const runtime = 'edge';

const xai = createXai({
  apiKey: process.env.XAI_API_KEY,
});

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  const result = await streamText({
    model: xai('grok-1.5-flash'),
    messages,
  });

  return result.toTextStreamResponse();
}