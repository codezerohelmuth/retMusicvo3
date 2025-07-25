// This file holds the Genkit flow for generating playlists based on various criteria.

'use server';

/**
 * @fileOverview AI-powered playlist generation based on mood, genre, BPM, or lyrics.
 *
 * - generatePlaylist - A function that generates a playlist based on given criteria.
 * - GeneratePlaylistInput - The input type for the generatePlaylist function.
 * - GeneratePlaylistOutput - The return type for the generatePlaylist function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePlaylistInputSchema = z.object({
  criteria: z
    .string()
    .describe(
      'The criteria for generating the playlist, such as mood, genre, BPM, or lyrics.'
    ),
  length: z
    .number()
    .optional()
    .describe('The desired length of the playlist in number of songs.  Must be between 5 and 50, defaults to 20.'),
});
export type GeneratePlaylistInput = z.infer<typeof GeneratePlaylistInputSchema>;

const SongSchema = z.object({
  title: z.string().describe('The title of the song.'),
  artist: z.string().describe('The artist of the song.'),
});

const GeneratePlaylistOutputSchema = z.object({
  playlistTitle: z.string().describe('The title of the generated playlist.'),
  songList: z.array(SongSchema).describe('A list of songs in the generated playlist.'),
  description: z.string().describe('A description of the playlist.'),
});
export type GeneratePlaylistOutput = z.infer<typeof GeneratePlaylistOutputSchema>;

export async function generatePlaylist(input: GeneratePlaylistInput): Promise<GeneratePlaylistOutput> {
  return generatePlaylistFlow(input);
}

const generatePlaylistPrompt = ai.definePrompt({
  name: 'generatePlaylistPrompt',
  input: {schema: GeneratePlaylistInputSchema},
  output: {schema: GeneratePlaylistOutputSchema},
  prompt: `You are a playlist generation expert. A user is requesting that you generate a playlist with the following criteria: "{{criteria}}". The user has optionally specified the length of the playlist to be {{length}} songs. If no length has been specified, default to 20 songs.

      Return a JSON object which contains a playlistTitle, songList, and description field.

      The songList field should be an array of songs that meets the specified criteria. Each song should have a "title" and "artist". Explain your reasoning for each song you chose in the description.`,
});

const generatePlaylistFlow = ai.defineFlow(
  {
    name: 'generatePlaylistFlow',
    inputSchema: GeneratePlaylistInputSchema,
    outputSchema: GeneratePlaylistOutputSchema,
  },
  async input => {
    const {output} = await generatePlaylistPrompt(input);
    return output!;
  }
);
