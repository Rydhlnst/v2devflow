import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';
import { AIAnswerSchema } from '@/lib/validations';
import { ValidationError } from '@/lib/http-errors';
import handleError from '@/lib/handlers/error';
import { APIErrorResponse } from '@/types/global';

export async function POST(req: Request) {
  try {
    const { question, content, language } = await req.json();

    // Validasi data dengan schema
    const validated = AIAnswerSchema.safeParse({ question, content, language });
    if (!validated.success) {
      throw new ValidationError(validated.error.flatten().fieldErrors);
    }

    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY!,
    });

    // Menambahkan informasi bahasa dalam prompt
    const prompt = `Generate a markdown-formatted response to the following question in ${language}: ${question}. Base it on the provided content:\n\n${content}`;

    // Menyiapkan permintaan streamText
    const response = streamText({
      model: openrouter('openai/gpt-3.5-turbo'),
      prompt,
      system: "You are a helpful assistant that provides informative responses in markdown format.",
    });

    await response.consumeStream(); // Penting agar dapat diakses
    const finalText = await response.text;

    return NextResponse.json({ success: true, data: finalText }, { status: 200 });

  } catch (error) {
    return handleError(error, 'api') as APIErrorResponse;
  }
}
