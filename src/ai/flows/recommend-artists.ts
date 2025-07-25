'use server';

/**
 * @fileOverview An AI agent that recommends similar artists based on a given artist.
 *
 * - recommendArtists - A function that recommends artists.
 * - RecommendArtistsInput - The input type for the recommendArtists function.
 * - RecommendArtistsOutput - The return type for the recommendArtists function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendArtistsInputSchema = z.object({
  artistName: z.string().describe('The name of the artist to find similar artists for.'),
});
export type RecommendArtistsInput = z.infer<typeof RecommendArtistsInputSchema>;

const RecommendArtistsOutputSchema = z.object({
  artistRecommendations: z.array(
    z.string().describe('A list of recommended artists similar to the input artist.')
  ).describe('A list of recommended artists.')
});
export type RecommendArtistsOutput = z.infer<typeof RecommendArtistsOutputSchema>;

export async function recommendArtists(input: RecommendArtistsInput): Promise<RecommendArtistsOutput> {
  return recommendArtistsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendArtistsPrompt',
  input: {schema: RecommendArtistsInputSchema},
  output: {schema: RecommendArtistsOutputSchema},
  prompt: `You are a music expert. A user is listening to a particular artist.

  Based on their listening history, recommend them other artists that they might enjoy.

  Artist: {{{artistName}}}

  Please provide a list of artists that are similar to the one above. No explanation is required. Just the names of the artists.
  Ensure the output matches the schema exactly.
  `,
});

const recommendArtistsFlow = ai.defineFlow(
  {
    name: 'recommendArtistsFlow',
    inputSchema: RecommendArtistsInputSchema,
    outputSchema: RecommendArtistsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
