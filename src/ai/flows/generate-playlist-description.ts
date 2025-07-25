// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview A flow to generate a description for a playlist.
 *
 * - generatePlaylistDescription - A function that generates a playlist description.
 * - GeneratePlaylistDescriptionInput - The input type for the generatePlaylistDescription function.
 * - GeneratePlaylistDescriptionOutput - The return type for the generatePlaylistDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePlaylistDescriptionInputSchema = z.object({
  playlistName: z.string().describe('The name of the playlist.'),
  songs: z
    .array(z.string())
    .describe('A list of songs in the playlist.'),
  description: z
    .string()
    .optional()
    .describe('A user provided description of the playlist.'),
});
export type GeneratePlaylistDescriptionInput = z.infer<
  typeof GeneratePlaylistDescriptionInputSchema
>;

const GeneratePlaylistDescriptionOutputSchema = z.object({
  playlistDescription: z.string().describe('The generated playlist description.'),
});
export type GeneratePlaylistDescriptionOutput = z.infer<
  typeof GeneratePlaylistDescriptionOutputSchema
>;

export async function generatePlaylistDescription(
  input: GeneratePlaylistDescriptionInput
): Promise<GeneratePlaylistDescriptionOutput> {
  return generatePlaylistDescriptionFlow(input);
}

const generatePlaylistDescriptionPrompt = ai.definePrompt({
  name: 'generatePlaylistDescriptionPrompt',
  input: {schema: GeneratePlaylistDescriptionInputSchema},
  output: {schema: GeneratePlaylistDescriptionOutputSchema},
  prompt: `You are a playlist curator who helps users generate descriptions for their playlists.

  Here is the playlist name: {{{playlistName}}}
  Here is the list of songs in the playlist: {{#each songs}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  {{#if description}}
  Here is a user provided description of the playlist: {{{description}}}
  {{/if}}

  Please generate a description for the playlist. The description should be no more than 2 sentences. Be creative and engaging.
  `,
});

const generatePlaylistDescriptionFlow = ai.defineFlow(
  {
    name: 'generatePlaylistDescriptionFlow',
    inputSchema: GeneratePlaylistDescriptionInputSchema,
    outputSchema: GeneratePlaylistDescriptionOutputSchema,
  },
  async input => {
    const {output} = await generatePlaylistDescriptionPrompt(input);
    return output!;
  }
);
