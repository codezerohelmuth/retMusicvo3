import { config } from 'dotenv';
config();

import '@/ai/flows/recommend-artists.ts';
import '@/ai/flows/generate-playlist.ts';
import '@/ai/flows/generate-playlist-description.ts';
import '@/ai/flows/explain-lyrics.ts';