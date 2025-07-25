'use server';

/**
 * @fileOverview Explains song lyrics using AI.
 *
 * - explainLyrics - A function that explains the lyrics of a song.
 * - ExplainLyricsInput - The input type for the explainLyrics function.
 * - ExplainLyricsOutput - The return type for the explainLyrics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainLyricsInputSchema = z.object({
  lyrics: z.string().describe('The lyrics to explain.'),
  highlightedText: z.string().describe('The specific lyrics to highlight and explain.'),
  artist: z.string().optional().describe('The artist of the song.'),
  title: z.string().optional().describe('The title of the song.'),
});
export type ExplainLyricsInput = z.infer<typeof ExplainLyricsInputSchema>;

const ExplainLyricsOutputSchema = z.object({
  explanation: z.string().describe('The AI explanation of the highlighted lyrics.'),
});
export type ExplainLyricsOutput = z.infer<typeof ExplainLyricsOutputSchema>;

export async function explainLyrics(input: ExplainLyricsInput): Promise<ExplainLyricsOutput> {
  return explainLyricsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainLyricsPrompt',
  input: {schema: ExplainLyricsInputSchema},
  output: {schema: ExplainLyricsOutputSchema},
  prompt: `You are an expert music analyst. A user has provided you with lyrics from a song, and they have highlighted a specific section of the lyrics.

Your job is to explain the meaning of the highlighted lyrics in the context of the song. Take into account any cultural references, metaphors, or other literary devices that are used in the lyrics.

Here are the lyrics:

{% if title %}Title: {{{title}}}\n{% endif %}
{% if artist %}Artist: {{{artist}}}\n{% endif %}
Lyrics: {{{lyrics}}}

Highlighted Lyrics: {{{highlightedText}}}

Explanation:`,
});

const explainLyricsFlow = ai.defineFlow(
  {
    name: 'explainLyricsFlow',
    inputSchema: ExplainLyricsInputSchema,
    outputSchema: ExplainLyricsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
