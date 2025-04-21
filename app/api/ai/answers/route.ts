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

    // Validasi input
    const validated = AIAnswerSchema.safeParse({ question, content, language });
    if (!validated.success) {
      throw new ValidationError(validated.error.flatten().fieldErrors);
    }

    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY!,
    });

    // Pemetaan bahasa ke nama lengkap (jika perlu)
    const languageMap: Record<string, string> = {
      id: "Indonesian",
      en: "English",
      fr: "French",
      es: "Spanish",
      de: "German",
      ja: "Japanese",
      ko: "Korean",
      zh: "Chinese",
      ru: "Russian",
      it: "Italian",
      pt: "Portuguese",
    };

    const targetLanguage = languageMap[language] || language;

    // Prompt eksplisit
    const prompt = `
You are a multilingual AI assistant. Answer the following question in ${targetLanguage}.
Use markdown formatting in your response. Base your answer on the content provided below.

Question:
${question}

Content:
${content}
    `.trim();

    const response = streamText({
      model: openrouter('openai/gpt-3.5-turbo'),
      prompt,
      system: `Always respond in ${targetLanguage} using markdown formatting. Provide clear and accurate explanations.`,
    });

    await response.consumeStream();
    const finalText = await response.text;

    return NextResponse.json({ success: true, data: finalText }, { status: 200 });

  } catch (error) {
    return handleError(error, 'api') as APIErrorResponse;
  }
}
