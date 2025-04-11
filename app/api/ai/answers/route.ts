import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { AIAnswerSchema } from '@/lib/validations';
import { ValidationError } from '@/lib/http-errors';
import handleError from '@/lib/handlers/error';
import { APIErrorResponse } from '@/types/global';

export async function POST(req: Request) {
  try {
    const { question, content } = await req.json();

    const validated = AIAnswerSchema.safeParse({ question, content });
    if (!validated.success) {
      throw new ValidationError(validated.error.flatten().fieldErrors);
    }

    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY!,
    });

    const response = streamText({
      model: openrouter('openai/gpt-3.5-turbo'), // Ganti dengan model lain kalau mau (pastikan valid)
      prompt: `Generate a markdown-formatted response to the following question: ${question}. Base it on the provided content:\n\n${content}`,
      system: "You are a helpful assistant that provides informative responses in markdown format.",
    });

    await response.consumeStream(); // Penting biar bisa diakses
    const finalText = await response.text;
    return NextResponse.json({ success: true, data:finalText }, { status: 200 });

  } catch (error) {
    return handleError(error, 'api') as APIErrorResponse;
  }
}
