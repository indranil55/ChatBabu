
'use server';

import { detectLanguage as detectLanguageFlow } from '@/ai/flows/detect-language';
import { emotionalResponse as emotionalResponseFlow } from '@/ai/flows/emotional-response-tool';
import type { DetectLanguageInput, DetectLanguageOutput } from '@/ai/flows/detect-language';
import type { EmotionalResponseInput, EmotionalResponseOutput } from '@/ai/flows/emotional-response-tool';

export async function detectLanguageAction(text: string): Promise<DetectLanguageOutput> {
  try {
    const input: DetectLanguageInput = { text };
    const result = await detectLanguageFlow(input);
    return result;
  } catch (error) {
    console.error("Error in detectLanguageAction:", error);
    throw new Error("Failed to detect language.");
  }
}

export async function getEmotionalResponseAction(
  message: string,
  emotion: string,
  language?: string
): Promise<EmotionalResponseOutput> {
  try {
    const input: EmotionalResponseInput = { message, emotion, language };
    // Add a small delay to simulate processing time, helpful for observing loading states
    // await new Promise(resolve => setTimeout(resolve, 1500)); 
    const result = await emotionalResponseFlow(input);
    return result;
  } catch (error) {
    console.error("Error in getEmotionalResponseAction:", error);
    throw new Error("Failed to get emotional response.");
  }
}
