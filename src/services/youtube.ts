
'use server';

import type { Track } from "@/context/player-context";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

interface YouTubeVideo {
    kind: string;
    etag: string;
    id: {
      kind: string;
      videoId: string;
    };
    snippet: {
      publishedAt: string;
      channelId: string;
      title: string;
      description: string;
      thumbnails: {
        default: { url: string; width: number; height: number; };
        medium: { url: string; width: number; height: number; };
        high: { url: string; width: number; height: number; };
      };
      channelTitle: string;
      liveBroadcastContent: string;
      publishTime: string;
    };
}


export async function searchYouTube(query: string): Promise<Track[]> {
    if (!YOUTUBE_API_KEY) {
        throw new Error("YouTube API key is not configured. Please add YOUTUBE_API_KEY to your .env.local file.");
    }

    const params = new URLSearchParams({
        part: 'snippet',
        type: 'video',
        maxResults: '20',
        q: query,
        key: YOUTUBE_API_KEY,
    });
    
    try {
        const response = await fetch(`${YOUTUBE_API_URL}/search?${params.toString()}`);

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error?.message || `An error occurred: ${response.statusText}`;
            console.error('YouTube API Error:', errorData);
            throw new Error(errorMessage);
        }

        const data = await response.json();
        
        return data.items.map((item: YouTubeVideo): Track => ({
            id: item.id.videoId,
            title: item.snippet.title,
            artist: item.snippet.channelTitle,
            thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
        }));

    } catch (error) {
        console.error('Failed to fetch from YouTube API:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

export async function getChannelVideos(channelId: string): Promise<Track[]> {
    if (!YOUTUBE_API_KEY) {
        throw new Error("YouTube API key is not configured. Please add YOUTUBE_API_KEY to your .env.local file.");
    }

    const params = new URLSearchParams({
        part: 'snippet',
        type: 'video',
        maxResults: '20',
        channelId: channelId,
        key: YOUTUBE_API_KEY,
    });
    
    try {
        const response = await fetch(`${YOUTUBE_API_URL}/search?${params.toString()}`);

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error?.message || `An error occurred: ${response.statusText}`;
            console.error('YouTube API Error:', errorData);
            throw new Error(errorMessage);
        }

        const data = await response.json();
        
        return data.items.map((item: YouTubeVideo): Track => ({
            id: item.id.videoId,
            title: item.snippet.title,
            artist: item.snippet.channelTitle,
            thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
        }));

    } catch (error) {
        console.error('Failed to fetch from YouTube API:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}
