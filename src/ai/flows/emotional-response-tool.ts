
// Emotional Response Tool
'use server';
/**
 * @fileOverview Implements the emotional response tool, allowing users to receive AI responses tailored to a specific emotional tone.
 *
 * - emotionalResponse - A function to generate AI responses with a chosen emotional tone.
 * - EmotionalResponseInput - The input type for the emotionalResponse function.
 * - EmotionalResponseOutput - The return type for the emotionalResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmotionalResponseInputSchema = z.object({
  message: z.string().describe('The user message to be responded to.'),
  emotion: z
    .string()
    .describe(
      'The desired emotional tone for the AI response (e.g., happy, sad, angry, excited).'
    ),
  language: z
    .string()
    .optional()
    .describe('The language of the user message and desired response.'),
});
export type EmotionalResponseInput = z.infer<typeof EmotionalResponseInputSchema>;

const EmotionalResponseOutputSchema = z.object({
  response: z.string().describe('The AI response with the specified emotional tone.'),
});
export type EmotionalResponseOutput = z.infer<typeof EmotionalResponseOutputSchema>;

export async function emotionalResponse(input: EmotionalResponseInput): Promise<EmotionalResponseOutput> {
  return emotionalResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'emotionalResponsePrompt',
  input: {schema: EmotionalResponseInputSchema},
  output: {schema: EmotionalResponseOutputSchema},
  prompt: `You are AIChatBabu, an intelligent, emotional, and helpful AI assistant.

You will generate a response to the user's message with the following specifications:

Language: {{language}}
Emotion: {{emotion}}
Message: {{message}}

Instructions:
- Understand the emotion behind the user's message.
- Respond in the same language as the user.
- Give a clear, helpful, and honest answer, tailored to the specified emotion.
- Use the specified emotion in the tone of your response.

Response:`,
});

const emotionalResponseFlow = ai.defineFlow(
  {
    name: 'emotionalResponseFlow',
    inputSchema: EmotionalResponseInputSchema,
    outputSchema: EmotionalResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
